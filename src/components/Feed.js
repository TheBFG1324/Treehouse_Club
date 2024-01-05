import React from 'react'
import FeedTemplatePost from './FeedTemplatePost';


function Feed(){
    let post = {
        account: "TheBFG1324",
        post: 'OdeToYes.pdf',
        postImage: "dec.jpeg",
        title: "Ode To Yes",
        date: "10/25/23",
        likes: 16,
        comments: {
            "Sally": "Good job Tim",
            "Bob": "Fuck you Tim"
        },
        commentsCount: 2,
        profilePicture: "test2.jpeg"
    };
    return(
       <div className='feed-container'>
            <div className='feedPosts-container'>
                <FeedTemplatePost postInfo={post} />
            </div>
       </div>
    )
}

export default Feed