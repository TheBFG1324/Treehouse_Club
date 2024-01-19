const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');




const app = express();
app.use(express.json()); 

const mongoUri = 'mongodb://127.0.0.1:27017/testDB'; // Simplified MongoDB URI
const dbName = 'testDB';

let db;
let googleIdMapping;
let accounts;
let posts;

MongoClient.connect(mongoUri)
    .then(client => {
        db = client.db(dbName);
        accounts = db.collection('accounts');
        posts = db.collection('posts');
        googleIdMapping = db.collection('googleIdMapping');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

async function checkIsEnrolled(googleId){

    const result = await googleIdMapping.find({googleId: googleId}).toArray()
    if(result.length != 0){
        return true
    }

    return false
}

async function checkHasAccount(object){

    const account = await accounts.findOne(object);
    if(account){
        return true
    }

    return  false
}

async function getPost(postId){
    if (!ObjectId.isValid(postId)) {
        return false;
    }

    const objectId = new ObjectId(postId);
    const post = await posts.findOne({_id: objectId});
    if (!post) {
        return false
    }

    return post
}

function areAllParametersValid(params) {
    return Object.values(params).every(param => param);
}
app.post('/api/create-account', async (req, res) => {
    try {
        const { googleId, email, publicName, profileImage } = req.body;
        const anonymousName = crypto.createHash('sha256').update(publicName).digest('hex').slice(24, 40);

        if (!areAllParametersValid({ googleId, email, publicName, profileImage })) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        const hasAccount = await checkHasAccount({ googleId: googleId });
        const accountNameTaken = await checkHasAccount({ name: publicName });
        const isEnrolled = await checkIsEnrolled(googleId);

        if (hasAccount || isEnrolled || accountNameTaken) {
            return res.status(400).json({ message: 'Account creation not allowed' });
        }

        const publicAccount = {
            googleId: googleId,
            email: email,
            name: publicName,
            profileImage: profileImage,
            posts: [],
            followers: [],
            following: [],
            engagements: 0
        };

        const anonymousAccount = {
            googleId: googleId,
            email: email,
            name: anonymousName,
            profileImage: profileImage,
            posts: [],
            followers: [],
            following: [],
            engagements: 0
        };

        const enrollAccountResult = await googleIdMapping.insertOne({ googleId: googleId, accounts: [publicName, anonymousName] });
        if (!enrollAccountResult.acknowledged) {
            throw new Error('Failed to enroll account');
        }

        try {
            const accountsResult = await accounts.insertMany([publicAccount, anonymousAccount]);
            if (!accountsResult.acknowledged) {
                // Rollback enrollAccount if accounts insert fails
                await googleIdMapping.deleteOne({ _id: enrollAccountResult.insertedId });
                throw new Error('Failed to create accounts');
            }
            res.status(200).json({ enrollId: enrollAccountResult.insertedId, accountsId: accountsResult.insertedIds, ...publicAccount, ...anonymousAccount });
        } catch (accountsError) {
            // Rollback enrollAccount if any error occurs in accounts creation
            await googleIdMapping.deleteOne({ _id: enrollAccountResult.insertedId });
            throw accountsError;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while creating account', error });
    }
});

app.get('/api/get-account-info', async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Missing name parameter' });
        }

        const hasAccount = await checkHasAccount({ name: name });
        
        if (hasAccount) {
            const account = await accounts.find({ name: name }).toArray();
            res.status(200).json(account[0]);
        } else {
            res.status(400).json({ message: "Account not found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
});


app.post('/api/create-post', async (req, res) => {
    try {
        const { title, name, postImage, post, googleId } = req.body;

        if (!areAllParametersValid({ title, name, postImage, post, googleId })) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        const hasAccount = await checkHasAccount({ name: name });
        if (!hasAccount) {
            return res.status(400).json({ message: "Account not found" });
        }

        const newItem = {
            owner: name,
            ownerId: googleId,
            title: title,
            post: post,
            postImage: postImage,
            date: new Date(),
            likes: [],
            comments: []
        };

        const postCreationResponse = await posts.insertOne(newItem);
        const postId = postCreationResponse.insertedId;

        const accountUpdateResponse = await accounts.updateOne({ name: name }, { $push: { posts: postId } });
        if (!accountUpdateResponse || accountUpdateResponse.modifiedCount === 0) {
            // Rollback: Delete the post that was just created
            await posts.deleteOne({ _id: postId });

            return res.status(500).json({ message: 'Failed to update account, post creation rolled back' });
        }

        res.status(200).json({ postID: postId, updateAccount: accountUpdateResponse });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while creating the post', error });
    }
});



app.get('/api/get-post', async (req, res) => {
    try {
        console.log(req.query)
        const {postId} = req.query;
        
        if(!postId){
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }
        const result = await getPost(postId);

        if (result) {
            res.status(200).json({ success: true, post: result });
        } else {
            res.status(404).json({ success: false, message: "post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching post', error: error.toString() });
    }
});


app.post('/api/delete-post', async (req, res) => {
    try {
        const { postId } = req.body;
        
        if (!postId || !ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Missing or invalid post ID' });
        }
        
        const objectId = new ObjectId(postId);
        const post = await posts.findOne({_id: objectId});
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const updateResult = await accounts.updateOne({ name: post.owner }, { $pull: { posts: objectId } });
        if (!updateResult || updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'Failed to update account posts' });
        }

        const deleteResult = await posts.deleteOne({ _id: objectId });
        if (!deleteResult || deleteResult.deletedCount !== 1) {
            // Rollback the update on failure to delete post
            await accounts.updateOne({ name: post.owner }, { $push: { posts: objectId } });
            return res.status(500).json({ message: 'Failed to delete post' });
        }
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while deleting post', error });
    }
});



app.post('/api/like-post', async (req, res) => {
    try {
        const {postId, callingAccount, otherAccount, insert} = req.body
        const objectId = new ObjectId(postId);
        const query = await getPost(postId)
        const post = query ? query: res.status(400).json({ message: 'Post not found' });
        if(!areAllParametersValid({post, callingAccount, otherAccount})){
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }
        let response, response2;
        if(insert){
            response = await posts.updateOne({_id: objectId}, {$inc: {likes: 1}})
            response2 = await accounts.updateOne({[fieldToUpdate]: otherAccount}, {$inc: {engagments: 1}})
        } else {
            response = await posts.updateOne({_id: objectId}, {$dec: {likes: 1}})
            response2 = await accounts.updateOne({[fieldToUpdate]: otherAccount}, {$dec: {engagments: 1}})
        }

        res.status(200).json([response, response2]);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

app.post('/api/comment-post', async (req, res) => {
    try {
        const {postId, callingAccount, otherAccount, insert, comment} = req.body
        const objectId = new ObjectId(postId);
        const query = await getPost(postId)
        const post = query.success ? query: res.status(400).json({ message: 'Post not found' });
        const isPublic = post.isPublic
        const fieldToUpdate = isPublic ? "publicName": "anonymousName"
        if(!areAllParametersValid({post, callingAccount, otherAccount})){
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }
        let response, response2;
        if(insert){
            response = await collection.updateOne({_id: objectId}, {$push: {comments: comment}})
            response2 = await collection.updateOne({[fieldToUpdate]: otherAccount}, {$inc: {engagments: 1}})
        } else {
            response = await collection.updateOne({_id: objectId}, {$pull: {comments: comment}})
            response2 = await collection.updateOne({[fieldToUpdate]: otherAccount}, {$dec: {engagments: 1}})
        }

        res.status(200).json([response, response2]);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
});

app.get('/api/search-account', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

app.post('/api/follow-unfollow', async (req, res) => {
    try {
        
        const {follow, callingAccount, otherAccount} = req.body;
        if(!areAllParametersValid({follow, callingAccount, otherAccount})){
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        let response1, response2;

        if(follow){
            response1 = await collection.updateOne({publicName: otherAccount}, {$push: {followers: callingAccount}});
            response2 = await collection.updateOne({publicName: callingAccount}, {$push: {following: otherAccount}});
        } else {
            response1 = await collection.updateOne({publicName: otherAccount}, {$pull: {followers: callingAccount}});
            response2 = await collection.updateOne({publicName: callingAccount}, {$pull: {following: otherAccount}});
        }
        
        res.status(200).json([response1, response2]);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

app.get('/api/load-posts', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

const PORT = 3000; // You can choose any port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
