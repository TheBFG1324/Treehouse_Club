const express = require('express');
const { MongoClient } = require('mongodb');
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

app.get('/api/create-post', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

app.get('/api/get-post', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
    
});

app.get('/api/delete-post', async (req, res) => {
    try {
        const itemData = req.body.key1;
        console.log(itemData)
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
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

app.get('/api/follow-unfollow', async (req, res) => {
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
