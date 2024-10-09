import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import './google.css'; 
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginComponent = ({ isInModal }) => { 
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Login Success:", tokenResponse);

        const decodedToken = jwtDecode(tokenResponse.access_token);
        const userData = {
          mail: decodedToken.email,
          name: decodedToken.name,
          username: null,
        };
        console.log("Decoded user data:", userData);

        const createUserApi = import.meta.env.VITE_CREATE_USER_API;
        const response = await axios.post(createUserApi, userData);
        console.log("User created successfully:", response.data);
      } catch (error) {
        console.error("Error processing login:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <button
      className={`custom-google-btn ${isInModal ? "modal-btn" : "header-btn"}`} 
      onClick={login} 
    >
      
      <FaGoogle className='google-logo' />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginComponent;
