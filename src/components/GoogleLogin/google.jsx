import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './google.css'; 
import { FaGoogle } from 'react-icons/fa';
import {useTimeOutContext} from '../../contexts/timeOutContext';
import PropTypes from 'prop-types';


const GoogleLoginComponent = ({ isInModal }) => { 
  const { login } = useTimeOutContext();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
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
        userData.name = response.data.name;
        userData.username = response.data.username;
        userData.is_active = response.data.is_active;
        userData.socials = response.data.socials;  
        login(userData); 
        if (response.status === 200) {
          window.location.href = "/home";
        }
        else {
          window.location.href = "/";
        }
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
      onClick={googleLogin} 
    >
      <FaGoogle className='google-logo' />
      Sign in with Google
    </button>
  );
};

GoogleLoginComponent.propTypes = {
  isInModal: PropTypes.bool,
}

export default GoogleLoginComponent;
