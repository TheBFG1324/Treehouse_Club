import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { GoogleLogin } from '@react-oauth/google';
import "./css/Login.css";
import { jwtDecode } from "jwt-decode";
import googleIdEnrolled from '../Api-Functions/googleIdEnrolled';
import sendFile from '../Api-Functions/sendFile';
import createAccount from '../Api-Functions/createAccount';

function Login(props) {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [userData, setUserData] = useState({ googleId: '', email: '', accountName: '', accountPicture: null, pictureType: '' });

    const handleLoginSuccess = async (response) => {
        const decodedToken = jwtDecode(response.credential)
        const email = decodedToken.email
        const googleId = CryptoJS.SHA256(decodedToken.sub).toString();
        const hasAccount = await googleIdEnrolled(googleId)
        if(!hasAccount.enrolled){
            setShowCreateAccount(true)
        }
        else {
            setShowCreateAccount(false)
            props.onSuccess(googleId)
        }

        setUserData({ ...userData, googleId: googleId, email: email });
    };

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        setUserData({ ...userData, accountPicture: event.target.files[0], pictureType: event.target.files[0].type});
    };

    const handleCreateAccount = async () => {
        const fileId = await sendFile(userData.accountPicture)
        if(fileId){
            const data = {
                googleId: userData.googleId,
                email: userData.email,
                publicName: userData.accountName,
                profileImage: fileId,
                imageType: userData.pictureType

            }
            const result = await createAccount(data)
            if(result.enrollId){
                props.onSuccess(userData.googleId)
                props.setUser(userData.accountName)
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-panel">
                <h1>The Treehouse Club</h1>
                {!showCreateAccount && (
                    <div>
                    <h2>Login to Your Account</h2>
                    <GoogleLogin className="google-login-button" onSuccess={handleLoginSuccess} onError={props.onError} />
                    </div>
                )}
                {showCreateAccount && (
                    <div className="create-account-form">
                        <h2>Create Account</h2>
                        <input type="text" name="accountName" placeholder="Account Name" onChange={handleInputChange} />
                        <input type="file" name="accountPicture" placeholder="Account Picture" onChange={handleFileChange} />
                        <input type="text" name="email" placeholder="Email" value={userData.email} readOnly />
                        <button className="create-account-button" onClick={handleCreateAccount}>Create Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;

