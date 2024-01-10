import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import "./css/Login.css";
import { jwtDecode } from "jwt-decode";

function Login(props) {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [userData, setUserData] = useState({ googleId: '', email: '', accountName: '', accountPicture: null });

    const handleLoginSuccess = (response) => {
        const credential = response.credential
        const email = jwtDecode(response.credential).email
        console.log(credential)
        console.log(email)
        if(true){
            setShowCreateAccount(true)
        }
        else {
            setShowCreateAccount(false)
        }

        setUserData({ ...userData, googleId: credential, email: email });
    };

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        setUserData({ ...userData, accountPicture: event.target.files[0] });
    };

    const handleCreateAccount = () => {
        props.onSuccess(userData.googleId)
        props.setUser("TheBFG1324")
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

