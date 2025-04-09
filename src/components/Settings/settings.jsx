import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";
import { useLogout } from "../../contexts/useLogout";
import axios from "axios";
import Footer from "../Footer/footer";
import { useAlertContext } from "../../contexts/alertContext";

export function Settings() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [settings, setSettings] = useState("about");
  const [userDetails, setUserDetails] = useState({
    name: userData?.name,
    username: userData?.username,
    mail: userData?.mail,
    is_active: userData?.isActive,
    github: userData?.socials?.GitHub || "",
    linkedin: userData?.socials?.LinkedIn || "",
    instagram: userData?.socials?.Instagram || "",
    facebook: userData?.socials?.Facebook || "",
    twitter: userData?.socials?.Twitter || "",
  });
  const [isAboutUpdated, setIsAboutUpdated] = useState(false);
  const [isSocialUpdated, setIsSocialUpdated] = useState(false);
  const [isUsernameUpdated, setIsUsernameUpdated] = useState(false);
  const [isGithubUpdated, setIsGithubUpdated] = useState(false);
  const [isLinkedinUpdated, setIsLinkedinUpdated] = useState(false);
  const [isInstagramUpdated, setIsInstagramUpdated] = useState(false);
  const [isFacebookUpdated, setIsFacebookUpdated] = useState(false);
  const [isTwitterUpdated, setIsTwitterUpdated] = useState(false);

  let apiKey = "VITE_API_KEY_" + new Date().getDay();

  const handleLogout = useLogout().handleLogout;
  const { showAlert } = useAlertContext();
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

  const handleEdit = useCallback(
    (property, value) => {
      setUserDetails((oldDetails) => ({ ...oldDetails, [property]: value }));
      if (property === "username") {
        setIsUsernameUpdated(true);
      } else if (property === "github") {
        setIsGithubUpdated(true);
      } else if (property === "linkedin") {
        setIsLinkedinUpdated(true);
      } else if (property === "instagram") {
        setIsInstagramUpdated(true);
      } else if (property === "facebook") {
        setIsFacebookUpdated(true);
      } else if (property === "twitter") {
        setIsTwitterUpdated(true);
      }
      if (settings === "about") {
        setIsAboutUpdated(true);
      }
      if (settings === "social") {
        setIsSocialUpdated(true);
      }
    },
    [settings]
  );

  const saveAboutData = async (userDetails) => {
    let aboutRequestBody = {
      id: userData.user_id,
      is_active: userData.is_active,
    };
    aboutRequestBody.name = userDetails.name;

    if (isUsernameUpdated) {
      aboutRequestBody.username = userDetails.username;
    }
    await axios
      .post(import.meta.env.VITE_POST_SAVE_ABOUT_GO_API, aboutRequestBody)
      .then((res) => {
        if (res.status === 200) {
          setIsAboutUpdated(false);
          userData.name = userDetails.name;
          userData.username = userDetails.username;
          localStorage.setItem("userData", JSON.stringify(userData));
          showAlert("User Information updated successfully", "success");
        }
      });
  };

  const isValidUrl = (url) => {
    try {
      if (url !== "") {
        new URL(url);
      }
      return true;
    } catch {
      return false;
    }
  };
  const saveSocialData = async (userDetails) => {
    let socialRequestBody = {
      user_id: userData.user_id,
      is_active: userData.is_active,
      socials: [],
    };
    let urlCheckPass = 0;
    try {
      if (isGithubUpdated && isValidUrl(userDetails.github)) {
        socialRequestBody.socials.push({ GitHub: userDetails.github });
        urlCheckPass++;
      }
      if (isLinkedinUpdated && isValidUrl(userDetails.linkedin)) {
        socialRequestBody.socials.push({ LinkedIn: userDetails.linkedin });
        urlCheckPass++;
      }
      if (isInstagramUpdated && isValidUrl(userDetails.instagram)) {
        socialRequestBody.socials.push({ Instagram: userDetails.instagram });
        urlCheckPass++;
      }
      if (isFacebookUpdated && isValidUrl(userDetails.facebook)) {
        socialRequestBody.socials.push({ Facebook: userDetails.facebook });
        urlCheckPass++;
      }
      if (isTwitterUpdated && isValidUrl(userDetails.twitter)) {
        socialRequestBody.socials.push({ Twitter: userDetails.twitter });
        urlCheckPass++;
      }
      if (urlCheckPass === 0) {
        throw new Error(
          "Please enter valid URLs for social media profiles beginning with https:// or http://"
        );
      }

      const response = await axios.post(
        import.meta.env.VITE_POST_SAVE_SOCIAL_GO_API,
        socialRequestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": import.meta.env[apiKey],
          },
        }
      );
      if (response.status === 200) {
        setIsSocialUpdated(false);
        userData.socials = {
          GitHub: userDetails.github,
          LinkedIn: userDetails.linkedin,
          Instagram: userDetails.instagram,
          Facebook: userDetails.facebook,
          Twitter: userDetails.twitter,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        showAlert("Social media profiles updated successfully", "success");
      }
    } catch (error) {
      showAlert(
        error.message ||
          "Failed to update social media profiles. Please try again later.",
        "error"
      );
    }
  };

  const handleOnSave = () => {
    if (settings === "about") {
      saveAboutData(userDetails);
    }
    if (settings === "social") {
      saveSocialData(userDetails);
    }
  };

  return (
    <div>
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
                  className={`px-6 py-3 bg-thought-100 text-white text-lg font-semibold rounded-lg hover:bg-thought-200 transition max-sm:px-4 max-sm:py-2 ${
                    !isAboutUpdated && !isSocialUpdated
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={handleOnSave}
                  disabled={!isAboutUpdated && !isSocialUpdated}
                >
                  Save
                </button>
              )}
              <div className="flex flex-row items-center hover:scale-105">
                <FiArrowLeft className="text-gray-900" />
                <a
                  href="/home"
                  className="text-hub-100 flex-shrink hover:underline"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
            maxLength="60"
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                handleEdit("name", value);
              }
            }}
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
            onChange={(e) => {
              handleEdit("username", e.target.value);
            }}
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
      props: "text-blue-600",
    },
    {
      name: "github",
      tag: FaGithub,
      placeholder: "GitHub URL",
      value: userDetails.github,
      onChange: (e) => handleEdit("github", e.target.value),
      props: "text-gray-800",
    },
    {
      name: "facebook",
      tag: FaFacebook,
      placeholder: "Facebook URL",
      value: userDetails.facebook,
      onChange: (e) => handleEdit("facebook", e.target.value),
      props: "text-blue-700",
    },
    {
      name: "instagram",
      tag: FaInstagram,
      placeholder: "Instagram URL",
      value: userDetails.instagram,
      onChange: (e) => handleEdit("instagram", e.target.value),
      props: "text-pink-900",
    },
    {
      name: "twitter",
      tag: FaXTwitter,
      placeholder: "Twitter URL",
      value: userDetails.twitter,
      onChange: (e) => handleEdit("twitter", e.target.value),
      props: "text-black",
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
              key={key.name}
              className="flex items-center space-x-4 hover:scale-105 transition-transform"
            >
              <Icon className={`${key.props} text-4xl`} />
              <InputField
                type="url"
                placeholder={key.placeholder}
                value={key.value || ""}
                onChange={key.onChange}
                pattern="https?://.*"
                title="Please enter a URL beginning with http:// or https://"
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
