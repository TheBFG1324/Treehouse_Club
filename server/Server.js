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

    app.post('/api/create-account', async (req, res) => {
        try {
            const googleId = req.body.googleId;
            const email = req.body.email;
            const publicName = req.body.publicName;
            const anonymousName = crypto.createHash('sha256').update(publicName).digest('hex').slice(24, 40);
            const accountImage = 1;
    
            if (!googleId || !email || !publicName || !accountImage) {
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
                accountImage: accountImage,
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
        const googleId = req.body.googleId;

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
        console.log("here")
        const title = req.body.title;
        const account = req.body.account;
        const isPublic = req.body.isPublic
        const postImage = req.body.postImage
        const post = req.body.post
        const googleId = req.body.googleId

        if (!googleId || !title || !account || !isPublic || !post || !postImage) {
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
        console.log("HERE")
        console.log(newItem)
        const response = await collection.insertOne(newItem);
        const postId = response.insertedId
        console.log(postId)
        let response2;
        if(isPublic){
            console.log("here")
            response2 = await collection.updateOne({googleId: googleId}, {$push: {publicPosts: postId}});
        } else {
            response2 = await collection.updateOne({googleId: googleId}, {$push: {anonymousPosts: postId}});
        }
        res.status(200).json({postID: postId, message2: response2});
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }   
});

app.get('/api/get-post', async (req, res) => {
    try {
        const postId = req.query.postId;
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await collection.findOne({_id: new ObjectId(postId)});
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while fetching post', error: error.toString() });
    }
});

app.post('/api/delete-post', async (req, res) => {
    try {
        const postId = req.body.postId;
        
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const response = await collection.deleteOne({_id: new ObjectId(postId)});
        res.status(200).json({ message: 'Post deleted successfully', success: true, response: response });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while deleting post', succes: false, error });
    }
});


app.get('/api/engage-post', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
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
        
        const follow = req.body.follow;
        const callingAccount = req.body.callingAccount;
        const otherAccount = req.body.otherAccount;

        let response1, response2;

        if(follow){
            response1 = await collection.updateOne({publicName: otherAccount}, {$push: {followers: callingAccount}});
            response2 = await collection.updateOne({publicName: callingAccount}, {$push: {following: otherAccount}});
        } else {
            response1 = await collection.updateOne({publicName: otherAccount}, {$pull: {followers: callingAccount}});
            response2 = await collection.updateOne({publicName: callingAccount}, {$pull: {following: otherAccount}});
        }
        const items = [response1, response2]
        console.log(items)
        res.status(200).json(items);
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
