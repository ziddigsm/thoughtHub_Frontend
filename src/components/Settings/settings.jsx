import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useLogout } from "../../contexts/useLogout";

export function Settings() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [settings, setSettings] = useState("about");
  const [userDetails, setUserDetails] = useState({
    name: userData?.name,
    username: userData?.username,
    mail: userData?.mail,
    is_active: userData?.isActive,
    github: userData?.socials?.github || "",
    linkedin: userData?.socials?.github || "",
    instagram: userData?.socials?.github || "",
    facebook: userData?.socials?.github || "",
    twitter: userData?.socials?.github || "",
  });

const handleLogout = useLogout().handleLogout;

  const handleSettings = (setting) => {
    switch (setting) {
      case "about":
        return (
          <AboutSection userDetails={userDetails} handleEdit={handleEdit} />
        );
      case "social":
        return (
          <SocialsSection userDetails={userDetails} handleEdit={handleEdit} />
        );
      case "options":
        return <OptionsSection handleLogout={handleLogout} />;
      default:
        return null;
    }
  };

  const handleEdit = useCallback((property, value) => {
    setUserDetails((oldDetails) => ({ ...oldDetails, [property]: value }));
  }, []);

  return (
    <div className="flex flex-row max-md:flex-col h-screen w-screen">
      <div className="flex flex-col max-md:flex-row items-center max-md:justify-between rounded-lg shadow-lg m-6 max-md:m-4 max-md:p-3 p-6 w-64 max-md:w-auto bg-white max-sm:m-3 max-sm:p-3">
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
            Social
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
      <div className="settings-content rounded-lg shadow-lg p-8  relative flex-grow m-6  bg-[url('src/assets/bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#ffffff] opacity-100 z-0"></div>
        <div className="relative z-10">
          {handleSettings(settings)}
          <div className="mt-8 flex justify-between text-center z-10">
            {settings !== "options" && (
              <button
                type="button"
                className="px-6 py-3 bg-thought-100 text-white text-lg font-semibold rounded-lg hover:bg-thought-200 transition max-sm:px-4 max-sm:py-2"
              >
                Save
              </button>
            )}
            <div className="flex flex-row items-center hover:scale-105">
              <FiArrowLeft className="text-gray-900" />
              <a href="/home" className="text-hub-100 flex-shrink hover:underline">
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutSection({ userDetails, handleEdit }) {
  return (
    <div className="container about">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">
        About
      </h2>
      <div className="space-y-6">
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <InputField
            type="text"
            placeholder="Enter your name"
            value={userDetails?.name}
            onChange={(e) => handleEdit("name", e.target.value)}
          />
        </div>
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <InputField
            type="text"
            placeholder="Enter your username"
            value={userDetails?.username}
            onChange={(e) => handleEdit("username", e.target.value)}
          />
        </div>
        <div className="hover:scale-105 transition-transform">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <InputField
            type="email"
            className="bg-gray-100"
            value={userDetails?.mail}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

AboutSection.propTypes = {
  userDetails: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

function SocialsSection({ userDetails, handleEdit }) {
  const socials = [
    {
      name: "linkedin",
      tag: FaLinkedin,
      placeholder: "LinkedIn URL",
      value: userDetails.linkedin,
      onChange: (e) => handleEdit("linkedin", e.target.value),
      props: 'text-blue-600'
    },
    {
      name: "github",
      tag: FaGithub,
      placeholder: "GitHub URL",
      value: userDetails.github,
      onChange: (e) => handleEdit("github", e.target.value),
      props: 'text-gray-800'
    },
    {
      name: "facebook",
      tag: FaFacebook,
      placeholder: "Facebook URL",
      value: userDetails.facebook,
      onChange: (e) => handleEdit("facebook", e.target.value),
      props: 'text-blue-700'
    },
    {
      name: "instagram",
      tag: FaInstagram,
      placeholder: "Instagram URL",
      value: userDetails.instagram,
      onChange: (e) => handleEdit("instagram", e.target.value),
      props: 'text-pink-900'
    },
    {
      name: "twitter",
      tag: FaTwitter,
      placeholder: "Twitter URL",
      value: userDetails.twitter,
      onChange: (e) => handleEdit("twitter", e.target.value),
      props: 'text-blue-400'
    },
  ];
  return (
    <div className="container socials">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">
        Social
      </h2>
      <div className="space-y-6">
        {socials.map((key) => {
          const Icon = key.tag;
          return (
            <div
              key={key}
              className="flex items-center space-x-4 hover:scale-105 transition-transform"
            >
              <Icon className={` ${key.props} text-4xl`} />
              <InputField
                type="url"
                placeholder={key.placeholder}
                value={key.value}
                onChange={key.onChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

SocialsSection.propTypes = {
  userDetails: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

function OptionsSection({ handleLogout }) {
  return (
    <div className="container options">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 max-sm:text-lg">
        Options
      </h2>
      <div className="space-y-6">
        <a className="block text-red-600 hover:text-red-800 transition">
          Delete Account
        </a>
        <button
          className="block text-blue-600 hover:text-blue-800 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

OptionsSection.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

const InputField = ({ type, placeholder, className, onChange, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full border rounded-lg p-3 hover:border-thought-100 focus:outline-none ${className}`}
      {...props}
      onChange={onChange}
    />
  );
};

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default Settings;
