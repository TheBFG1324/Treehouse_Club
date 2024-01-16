const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');




const app = express();
app.use(express.json()); 

const mongoUri = 'mongodb://127.0.0.1:27017/learningDB'; // Simplified MongoDB URI
const dbName = 'learningDB';

let db;
let collection;

MongoClient.connect(mongoUri)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        collection = db.collection('users');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

async function getAccount(object){
    return await collection.findOne(object);
}

async function getPost(postId){
    if (!ObjectId.isValid(postId)) {
        return { sucess: false, message: 'Invalid post ID' };
    }

    const objectId = new ObjectId(postId);
    const post = await collection.findOne({_id: objectId});
    if (!post) {
        return { sucess: false, message: 'Post not found' };
    }

    return post
}

function areAllParametersValid(params) {
    return Object.values(params).every(param => param);
}
    app.post('/api/create-account', async (req, res) => {
        try {

            const { googleId, email, publicName } = req.body;
            const anonymousName = crypto.createHash('sha256').update(publicName).digest('hex').slice(24, 40);

            
            if (!areAllParametersValid({ googleId, email, publicName })) {
                return res.status(400).json({ message: 'Missing or invalid parameters in request' });
            }

            if( await getAccount({googleId: googleId})){
                return res.status(400).json({ message: 'already has an account' });
            }
    
            const newItem = {
                googleId: googleId,
                email: email,
                publicName: publicName,
                anonymousName: anonymousName,
                accountImage: 1,
                publicPosts: [],
                anonymousPosts: [],
                followers: [],
                following: [],
                engagements: 0
            };
            
            const result = await collection.insertOne(newItem);
            res.status(200).json({ insertedId: result.insertedId, ...newItem });
        } catch (error) {
            res.status(500).json({ message: 'Error occurred while creating account', error });
        }
    });
    


app.get('/api/get-account-info', async (req, res) => {
    try {
        const {googleId} = req.body;

        if (!googleId) {
            return res.status(400).json({ message: 'Missing or invalid googleId in request' });
        }

        const account = await getAccount({googleId: googleId});
        res.status(200).json(account);

    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
});

app.post('/api/create-post', async (req, res) => {
    try {
        const { title, account, isPublic, postImage, post, googleId} = req.body

        if (!areAllParametersValid({title, account, postImage, post, googleId})) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }
        const newItem = {
            account: account,
            ownerId: googleId,
            isPublic: isPublic,
            title: title,
            post: post,
            postImage: postImage,
            date: new Date(),
            likes: [],
            comments: []
        }

        const response = await collection.insertOne(newItem);
        const postId = response.insertedId
        let response2;
        const fieldToUpdate = isPublic ? 'publicPosts': 'anonymousPosts'
        response2 = await collection.updateOne({googleId: googleId}, {$push: {[fieldToUpdate]: postId}});

        res.status(200).json({postID: postId, message2: response2});
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }   
});

app.get('/api/get-post', async (req, res) => {
    try {
        const {postId} = req.body;
        const result = await getPost(postId);

        if (result.success) {
            res.status(200).json({ success: true, post: result.post });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while fetching post', error: error.toString() });
    }
});


app.post('/api/delete-post', async (req, res) => {
    try {
        const { postId } = req.body;
        
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const objectId = new ObjectId(postId);
        const post = await collection.findOne({_id: objectId});
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const response1 = await collection.deleteOne({_id: objectId});
        const fieldToUpdate = post.isPublic ? 'publicPosts' : 'anonymousPosts';
        const response2 = await collection.updateOne({googleId: post.ownerId}, {$pull: {[fieldToUpdate]: objectId}});

        res.status(200).json({ message: 'Post deleted successfully', success: true, response1, response2 });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while deleting post', success: false, error });
    }
});



app.post('/api/like-post', async (req, res) => {
    try {
        const {postId, callingAccount, otherAccount, insert} = req.body
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
            response = await collection.updateOne({_id: objectId}, {$inc: {likes: 1}})
            response2 = await collection.updateOne({[fieldToUpdate]: otherAccount}, {$inc: {engagments: 1}})
        } else {
            response = await collection.updateOne({_id: objectId}, {$dec: {likes: 1}})
            response2 = await collection.updateOne({[fieldToUpdate]: otherAccount}, {$dec: {engagments: 1}})
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
