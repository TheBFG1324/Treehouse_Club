const axios = require('axios');


async function createAccount() {
    try {
      const response = await axios.post('http://localhost:3000/api/create-account', {
        googleId: 4,
        email: "cwdenton5@gmail.com",
        publicName: "C",
        profileImage: "1",
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

async function deletePost() {
  try {
    const response = await axios.post('http://localhost:3000/api/delete-post', {
      postId: "65a9cd1faac867dd8043c979"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function createPost() {
    try {
      const response = await axios.post('http://localhost:3000/api/create-post', {
        title: "testing",
        name: "b0a617355deb1127",
        postImage: 1,
        post: 1,
        googleId: 3
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

  async function getPost() {
    try {
      const response = await axios.get('http://localhost:3000/api/get-post', {
        params: {
          postId: "65a9cd98aac867dd8043c97a"
        }
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
  

async function getAccountInfo() {
    try {
      const response = await axios.get('http://localhost:3000/api/get-account-info', {
        params: {
          name: "b0a617355deb1127"
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function followUnfollow(){
    try {
        const response = await axios.post('http://localhost:3000/api/follow-unfollow', {
          follow: false,
          callingAccount: "C",
          otherAccount: "b0a617355deb1127"
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
}

async function likePost(){
    try {
        const response = await axios.post('http://localhost:3000/api/like-post', {
          insert: false,
          callingAccount: "C",
          otherAccount: "b0a617355deb1127",
          postId: "65a9cd98aac867dd8043c97a"
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      } 
}

async function commentPost(){
    try {
        const response = await axios.post('http://localhost:3000/api/comment-post', {
          insert: false,
          callingAccount: "C",
          otherAccount: "b0a617355deb1127",
          postId: "65a9cd98aac867dd8043c97a",
          comment: {name: "C",
                    string: "this shit sucks", date:'2024-01-22T16:04:27.311Z'}
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }  
}

async function searchAccount() {
    try {
        const response = await axios.get('http://localhost:3000/api/search-account', {
            params: { name: "a" }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}
searchAccount();
