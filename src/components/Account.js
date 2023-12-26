import React from 'react'
import './componentcss/Account.css'

function Account(){
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
                <h1>Account posts</h1>
            </div>
        </div>
    )
}
export default Account