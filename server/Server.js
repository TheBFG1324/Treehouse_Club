const express = require('express');
const { MongoClient } = require('mongodb');

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


app.get('/api/items', async (req, res) => {
    try {
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
