import React from 'react'
import './componentcss/Account.css'
import AccountTemplatePost from './AccountTemplatePost'

function Account(){

    let props = {
        account: "tim", 
        coverPhoto: 'OdeToYes.pdf',
        postImage: "dec.jpeg",
        title: "Ode To Yes ",
        date: "10/25/23",
        likes: 16,
        comments: {
            "Sally": "Good job Tim",
            "Bob": "Fuck you Tim"
        },
        commentsCount: 2
        }
        const posts = [props, props, props, props, props, props];

    return(
        <div className='account-container'>
            <div className='account-header'>
                <div className='account-picture'>
                    <img src="test2.jpeg" alt="profile pic" className="circle-image"/>
                    <h1 className='profile-name'>TheBFG1324</h1>

                </div>
                <div className='account-information'>
                    <div className='posts'>
                        <h2 className='posts-count'>170</h2>
                        <h3 className='post-title'>posts</h3>
                    </div>
                    <div className='followers'>
                        <h2 className='followers-count'>170k</h2>
                        <h3 className='followers-title'>followers</h3>
                    </div>
                    <div className='following'>
                        <h2 className='following-count'>170</h2>
                        <h3 className='following-title'>following</h3>
                    </div>
                    <div className='engagements'>
                        <h2 className='engagements-count'>100k</h2>
                        <h3 className='engagement-title'>engagement</h3> 
                    </div>
                </div>
            </div>
            <div className='account-posts'>
                {posts.map((post, index) => (
                    <AccountTemplatePost key={index} props={post} />
                ))}
            </div>
        </div>
    )
}
export default Account