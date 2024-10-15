import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './google.css'; 
import { FaGoogle } from 'react-icons/fa';
import {useTimeOutContext} from '../../contexts/timeOutContext';


// eslint-disable-next-line react/prop-types
const GoogleLoginComponent = ({ isInModal }) => { 
  const { login } = useTimeOutContext();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Login Success:", tokenResponse.access_token);
        const userInfoResponse = await axios.get(import.meta.env.VITE_GET_USER_INFO_GOOGLE_API, {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });        
        const userData = {
          mail: userInfoResponse.data?.email,
          name: userInfoResponse.data?.name,
          username: null,
        };
        const createUserApi = import.meta.env.VITE_CREATE_USER_API;
        const response = await axios.post(createUserApi, userData);
        userData.user_id = response.data.user_id;
        
        login(userData); 
        console.log("User Logged in successfully:", response.data);
        if (response.status === 200) {
          window.location.href = "/settings";
        }
        else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error processing login:", error);
      }
    },
    onError: () => {
      console.log("Login Failxed");
    },
  });

  return (
    <button
      className={`custom-google-btn ${isInModal ? "modal-btn" : "header-btn"}`} 
      onClick={googleLogin} 
    >
      
      <FaGoogle className='google-logo' />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginComponent;
