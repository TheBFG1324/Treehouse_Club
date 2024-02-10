const express = require('express');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const crypto = require('crypto');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your React app's URL
}));

const mongoUri = 'mongodb://127.0.0.1:27017/testDB'; // Simplified MongoDB URI
const dbName = 'testDB';

let db;
let googleIdMapping;
let accounts;
let posts;
let gfs;

MongoClient.connect(mongoUri)
    .then(client => {

        db = client.db(dbName);
        gfs = new GridFSBucket(db, {
            bucketName: 'uploads'
        });

        accounts = db.collection('accounts');
        posts = db.collection('posts');
        googleIdMapping = db.collection('googleIdMapping');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

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

async function getAccount(object){
    return await accounts.findOne(object)
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

app.get('/api/google-id-enrolled', async (req, res) => {
    try {
        const { googleId } = req.query;
        if (!googleId) {
            return res.status(400).json({ message: 'Missing name parameter' });
        }
        const result = await googleIdMapping.findOne({googleId: googleId})
        if (result) {
            res.status(200).json({enrolled: true, result: result});
        } else {
            res.status(200).json({ enrolled: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
});

app.post('/api/create-account', async (req, res) => {
    try {
        const { googleId, email, publicName, profileImage, imageType } = req.body;
        const anonymousName = crypto.createHash('sha256').update(publicName).digest('hex').slice(24, 40);

        if (!areAllParametersValid({ googleId, email, publicName, profileImage, imageType })) {
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
            imageType: imageType,
            posts: [],
            followers: [],
            following: [],
            engagements: 0
        };

        const anonymousAccount = {
            googleId: googleId,
            email: email,
            name: anonymousName,
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
        const { title, name, postImage, post, googleId, postType, imageType } = req.body;
  
        if (!areAllParametersValid({ title, name, postImage, post, googleId, postType, imageType })) {
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
            postType: postType,
            postImage: postImage,
            imageType: imageType,
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
        const { postId, callingAccount, otherAccount, insert } = req.body;
        const objectId = new ObjectId(postId);
        const postQuery = await getPost(postId);
        const hasAccount1 = await checkHasAccount({ name: callingAccount });
        const hasAccount2 = await checkHasAccount({ name: otherAccount });

        if (!postQuery) {
            return res.status(400).json({ message: 'Post not found' });
        }

        if (!areAllParametersValid({ postId, callingAccount, otherAccount })) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        if (!hasAccount1 || !hasAccount2) {
            return res.status(400).json({ message: 'One or both of accounts are not found' });
        }

        const alreadyLiked = postQuery.likes.includes(callingAccount);
        if ((insert && alreadyLiked) || (!insert && !alreadyLiked)) {
            return res.status(400).json({ message: 'Invalid like operation' });
        }

        let postUpdateResponse = await posts.updateOne(
            { _id: objectId }, 
            insert ? { $push: { likes: callingAccount } } : { $pull: { likes: callingAccount } }
        );

        if (!postUpdateResponse || postUpdateResponse.modifiedCount === 0) {
            throw new Error('Failed to update post');
        }

        try {
            let accountUpdateResponse = await accounts.updateOne(
                { name: otherAccount }, 
                insert ? { $inc: { engagements: 1 } } : { $inc: { engagements: -1 } }
            );

            if (!accountUpdateResponse || accountUpdateResponse.modifiedCount === 0) {
                // Rollback the post update if account update fails
                await posts.updateOne(
                    { _id: objectId }, 
                    insert ? { $pull: { likes: callingAccount } } : { $push: { likes: callingAccount } }
                );
                throw new Error('Failed to update account');
            }

            res.status(200).json([postUpdateResponse, accountUpdateResponse]);
        } catch (accountUpdateError) {
            // Handle failure in updating account
            throw accountUpdateError;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while processing like operation', error: error.toString() });
    }
});


app.post('/api/comment-post', async (req, res) => {
    try {
        const { postId, callingAccount, otherAccount, insert, comment } = req.body;
        const objectId = new ObjectId(postId);
        const postQuery = await getPost(postId);
        const hasAccount1 = await checkHasAccount({ name: callingAccount });
        const hasAccount2 = await checkHasAccount({ name: otherAccount });

        if (!postQuery) {
            return res.status(400).json({ message: 'Post not found' });
        }

        if (!areAllParametersValid({ postId, callingAccount, otherAccount, comment })) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        if (!hasAccount1 || !hasAccount2) {
            return res.status(400).json({ message: 'One or both of accounts are not found' });
        }

        let postUpdateResponse = await posts.updateOne(
            { _id: objectId }, 
            insert ? { $push: { comments: comment } } : { $pull: { comments: comment } }
        );

        if (!postUpdateResponse || postUpdateResponse.modifiedCount === 0) {
            throw new Error('Failed to update post');
        }

        try {
            let accountUpdateResponse = await accounts.updateOne(
                { name: otherAccount }, 
                { $inc: { engagements: insert ? 1 : -1 } }
            );

            if (!accountUpdateResponse || accountUpdateResponse.modifiedCount === 0) {
                // Rollback the post update if account update fails
                await posts.updateOne(
                    { _id: objectId }, 
                    insert ? { $pull: { comments: comment } } : { $push: { comments: comment } }
                );
                throw new Error('Failed to update account');
            }

            res.status(200).json({ postUpdate: postUpdateResponse, accountUpdate: accountUpdateResponse });
        } catch (accountUpdateError) {
            throw accountUpdateError;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while processing comment operation', error: error.toString() });
    }
});


app.get('/api/search-account', async (req, res) => {
    try {

        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }
        const queryRegex = new RegExp(name, 'i');
        const foundAccounts = await accounts.find({ name: queryRegex }).sort({ "engagements": -1 }).toArray();
        res.status(200).json(foundAccounts);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching items', error });
    }
});


app.post('/api/follow-unfollow', async (req, res) => {
    try {
        const { follow, callingAccount, otherAccount } = req.body;
        if (!areAllParametersValid({ callingAccount, otherAccount })) {
            return res.status(400).json({ message: 'Missing or invalid parameters in request' });
        }

        const otherAccountData = await accounts.findOne({ name: otherAccount }, { projection: { followers: 1 } });

        if (!otherAccountData) {
            return res.status(404).json({ message: 'Other account not found' });
        }
        const alreadyFollowing = otherAccountData.followers.includes(callingAccount);

        if (alreadyFollowing && follow) {
            return res.status(400).json({ message: 'Already following account' });
        }

        const updateOperation = follow ? '$push' : '$pull';
        const update1 = await accounts.updateOne({ name: otherAccount }, { [updateOperation]: { followers: callingAccount } });

        if (!update1.acknowledged || update1.modifiedCount === 0) {
            throw new Error('Failed to update followers');
        }

        try {
            const update2 = await accounts.updateOne({ name: callingAccount }, { [updateOperation]: { following: otherAccount } });
            if (!update2.acknowledged || update2.modifiedCount === 0) {
                // Rollback the first update
                const rollbackOperation = follow ? '$pull' : '$push';
                await accounts.updateOne({ name: otherAccount }, { [rollbackOperation]: { followers: callingAccount } });
                throw new Error('Failed to update following');
            }

            res.status(200).json({ message: 'Update successful', follow, otherAccount, callingAccount });
        } catch (update2Error) {
            // If second update fails, log the error and send response
            console.error('Error during second update:', update2Error);
            res.status(500).json({ message: 'Error occurred during following update', error: update2Error.toString() });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Error occurred while updating accounts', error: error.toString() });
    }
});


app.get('/api/load-posts', async (req, res) => {
    try {
        // Assuming callingAccount and round are passed as query parameters
        const { callingAccount, round } = req.query;
        
        if (!callingAccount || isNaN(round)) {
            return res.status(400).json({ message: 'Missing or invalid parameters' });
        }
        
        const roundNumber = parseInt(round, 10);
        const hasAccount = await checkHasAccount({ name: callingAccount });
        
        if (!hasAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
        const account = await getAccount({ name: callingAccount });
        const following = account.following;

        let postIds = [];
        for (const followerName of following) {
            const followerAccount = await db.collection('accounts').findOne({ name: followerName });
            if (followerAccount && followerAccount.posts) {
                postIds = postIds.concat(followerAccount.posts);
            }
        }

        const postsPerRound = 7;
        const startIndex = roundNumber * postsPerRound;
        const endIndex = startIndex + postsPerRound;

        const posts = await db.collection('posts').find({ 
            _id: { $in: postIds }
        }).sort({ date: -1, engagements: -1 }).toArray();

        const currentRoundPostIds = posts.slice(startIndex, endIndex).map(post => post._id);
        res.status(200).json(currentRoundPostIds);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Error occurred while fetching posts' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadStream = gfs.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', (file) => {
        // respond with the file information
        res.status(201).send({ fileId: uploadStream.id });
    });

    uploadStream.on('error', (error) => {
        console.error('Stream error:', error);
        res.status(500).json({ message: 'Error uploading file', error });
    });
});


app.get('/api/files/:id', (req, res) => {
    const fileId = req.params.id;
  
    // Check if fileId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).send('Invalid file ID.');
    }
    const id = new ObjectId(fileId)
    // Create a stream to download the file from GridFS
    const downloadStream = gfs.openDownloadStream(id);
  
    res.setHeader('Content-Type', 'application/octet-stream');
  
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
  
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(404).send('File not found');
    });
  
    downloadStream.on('end', () => {
      res.end();
    });
  });



const PORT = 4000; // You can choose any port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
