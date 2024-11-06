import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Settings } from "./components/Settings/settings";
import Login from "./components/Login/login";
import Home from "./components/Home/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
