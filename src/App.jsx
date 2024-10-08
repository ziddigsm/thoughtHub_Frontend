import "./App.css";
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { Settings } from "./components/Settings/settings";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  const handleSuccess = async (credentialResponse) => {
    console.log("Success:", credentialResponse);
    const userData = {};
    const decodedToken = jwtDecode(credentialResponse.credential);
    userData.mail = decodedToken.email;
    userData.name = decodedToken.name;
    userData.username = null;
    console.log(userData);
    let res = "";
    const createUserApi = import.meta.env.VITE_CREATE_USER_API;
   await axios.post(createUserApi, userData).then((response) => {
    console.log(response);
    res = response.data;
   }).catch(err=>{
    console.log(err)
   });
    console.log("User created successfully:", res);
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/settings">Go to Settings</Link>
        </nav>
      
      <h1>Welcome to ThoughtHub</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      <Routes>
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
