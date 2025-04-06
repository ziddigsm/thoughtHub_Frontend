import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Settings } from "./components/Settings/settings";
import Login from "./components/Login/login";
import Home from "./components/Home/Home";
import { WarningProvider } from "./contexts/warningContext";

function App() {
  let userData = localStorage.getItem("userData");
  return (
    <WarningProvider>
    <Router>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Login />} />
        <Route path="/home" element={userData ? <Home /> : <Navigate to={"/"} />} />
        <Route path="/settings" element={userData ? <Settings /> : <Navigate to={"/"} /> } />
      </Routes>
    </Router>
    </WarningProvider>
  );
}

export default App;
