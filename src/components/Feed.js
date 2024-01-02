import React from 'react'
import GeneratePost from './API/PostTemplate'

function Feed(){
    let props = {
        account: "tim", 
        postImage: "dec.jpeg",
        coverPhoto: 'OdeToYes.pdf',
        data: "Ode To Yes ",
        date: "10/25/23",
        likes: 16,
        comments: {
            "Sally": "Good job Tim",
            "Bob": "Fuck you Tim"
        }
        }
    return(
       <GeneratePost props={props}/>
    )
}

export default Feed