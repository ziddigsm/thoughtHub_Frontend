import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

export function Settings() {
  const [settings, setSettings] = useState("about");

  const handleSettings = (setting) => {
    switch (setting) {
      case "about":
        return aboutSection();
      case "social":
        return socialsSection();
      case "options":
        return optionsSection();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row max-md:flex-col h-screen w-screen">
  <div className="flex flex-col max-md:flex-row items-center max-md:justify-between rounded-lg shadow-lg m-6 p-6 w-64 max-md:w-auto bg-white max-sm:m-3 max-sm:p-3">
    <h1 className="text-4xl text-gray-900 font-bold p-4 text-center max-sm:text-lg">
      Settings
    </h1>
    <ul className="flex flex-col max-md:flex-row space-y-7 max-md:space-y-0 max-md:space-x-8 text-gray-900 text-center mt-4 max-md:mt-0 max-sm:text-sm">
      <li
        onClick={() => setSettings("about")}
        className={`cursor-pointer hover:text-thought-100 ${
          settings === "about"
            ? "text-thought-200 font-semibold"
            : "text-gray-900"
        }`}
      >
        About
      </li>
      <li
        onClick={() => setSettings("social")}
        className={`cursor-pointer hover:text-thought-100 ${
          settings === "social"
            ? "text-thought-200 font-semibold"
            : "text-gray-900"
        }`}
      >
        Socials
      </li>
      <li
      onClick={() => setSettings("options")}
      className={`cursor-pointer hover:text-thought-100 ${
        settings === "options"
          ? "text-thought-200 font-semibold"
          : "text-gray-900"
      }`}
      >
        Options
      </li>
    </ul>
  </div>

      <div className="settings-content rounded-lg shadow-lg p-8 flex-grow m-6">
        {handleSettings(settings)}
        <div className="mt-8 flex justify-between text-center">
          {(settings !== "options")?<button
            type="button"
            className="px-6 py-3 bg-thought-100 text-white text-lg font-semibold rounded-lg hover:bg-thought-200 transition max-sm:px-4 max-sm:py-2"
          >
            Save
          </button>:null}
          <div className="flex flex-row items-center hover:scale-105" >
            <FiArrowLeft className="text-gray-900" />
          <a href="/#" className="text-hub-100 flex-shrink hover:underline">Go to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function aboutSection() {
  return (
    <div className="container about">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">About</h2>
      <div className="space-y-6">
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <InputField type="text" placeholder = "Enter your name" />
        </div>
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <InputField type="text" placeholder = "Enter your username" />
        </div>
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <InputField type="email" value="123@mail.com"  className = "bg-gray-100" disabled />
        </div>
      </div>
    </div>
  );
}

function socialsSection() {
  return (
    <div className="container socials">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">Social</h2>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform">
          <FaLinkedin className="text-blue-600" />
          <InputField type="url" placeholder="LinkedIn URL"/>
        </div>
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform">
          <FaGithub className="text-gray-800 " />
          <InputField type="url" placeholder="GitHub URL"/>
        </div>
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform">
          <FaFacebook className="text-blue-700" />
          <InputField type="url" placeholder="Facebook URL"/>
        </div>
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform">
          <FaInstagram className="text-pink-900" />
          <InputField type="url" placeholder="Instagram URL"/>
        </div>
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform">
          <FaTwitter className="text-blue-400" />
          <InputField type="url" placeholder="Twitter URL"/>
        </div>
      </div>
    </div>
  );
}

function optionsSection() {
  return (
    <div className="container options">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">Options</h2>
      <div className="space-y-6">
        <a
          href="#"
          className="block text-red-600 hover:text-red-800 transition"
        >
          Delete Account
        </a>
        <a
          href="#"
          className="block text-blue-600 hover:text-blue-800 transition"
        >
          Logout
        </a>
      </div>
    </div>
  );
}

const InputField = ({type, placeholder, className, ...props}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full border rounded-lg p-3 hover:border-thought-100 focus:outline-none ${className}`}
            {...props}
          />
    )
}

InputField.propTypes = {
    type: PropTypes.string.isRequred,
    placeholder: PropTypes.string,
    className: PropTypes.string
}

export default Settings;
