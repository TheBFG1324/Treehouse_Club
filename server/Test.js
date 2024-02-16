const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const serverUrl = 'http://localhost:3000';

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

async function uploadFile(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  try {
      const response = await axios.post(`http://localhost:4000/api/upload`, formData, {
          headers: {
              ...formData.getHeaders(),
          },
      });
      return response.data.fileId; // Assuming the response contains the filename
  } catch (error) {
      console.error('Error uploading file:', error.message);
  }
}

async function downloadFile(fileId) {
  try {
    // Axios GET request to the file download API endpoint
    const response = await axios({
      method: 'GET',
      url: `http://localhost:4000/api/pdf/${fileId}`,
      responseType: 'stream' // This is important to handle the response as a stream
    });

    // Pipe the response stream directly into a file
    const writer = fs.createWriteStream('downloadedFile');

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file:', error.message);
    throw error; // Rethrow the error if you want to handle it later
  }
}

async function testFileUploadAndDownload() {
  const filePath = "/Users/camerondenton/Desktop/Treehouse Club /treehouseclub/server/test2.jpeg"
  const fileId = await uploadFile(filePath);
  console.log(fileId)
  if(fileId){
    await downloadFile(fileId)
    .then(() => console.log('File downloaded successfully.'))
    .catch(error => console.error('File download failed:', error));
  }

}

testFileUploadAndDownload();

