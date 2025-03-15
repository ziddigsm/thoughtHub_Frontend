import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { GrClose, GrSearch, GrUserManager } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
// import { FaHeart, FaComment } from "react-icons/fa";
import { useLogout } from "../../contexts/useLogout";
import { NewBlogModal } from "../Blog/newblog";
import Footer from "../Footer/footer";
import { FetchBlogs } from "../Blog/blog";
import { Alert } from "../Settings/alert";
// import { BlogModal } from "./BlogModal";
// import axios from "axios";

function SearchBar({ searchQuery, setSearchQuery, setIsSearching }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
      <form
        onSubmit={handleSubmit}
        className={`transform transition-all duration-300 ${
          isSearchFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div className="relative flex items-center p-2 rounded-full bg-white border-2 border-gray-200 focus-within:border-thought-100 focus-within:ring-2 focus-within:ring-thought-100/5 transition-all duration-300 shadow-lg">
          <GrSearch className="ml-3 text-gray-400 w-5 h-5" />
          <input
            className="flex-grow px-4 py-2 bg-transparent focus:outline-none placeholder-gray-500 text-lg"
            placeholder="Search for blogs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button
            type="submit"
            className={`p-2 px-4 py-2 bg-thought-100 rounded-full text-white hover:bg-hub-100 transition-all duration-300 flex items-center justify-center ${
              isSmallScreen ? "w-10 h-10" : ""
            }`}
          >
            {!isSmallScreen ? "Search" : <GrSearch className="text-white" />}
          </button>
        </div>
      </form>
    </div>
  );
}
SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setIsSearching: PropTypes.func.isRequired,
};

function Home() {
  const [dropDown, setDropDown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isMyBlogs, setIsMyBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  //const [selectedBlog, setSelectedBlog] = useState(null);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const navigate = useNavigate();

  const navBarItems = [
    { name: "Tech" },
    { name: "Travel" },
    { name: "Business" },
    { name: "Science" },
    { name: "Cooking" },
  ];

  const dropDownItems = [
    { name: "Entertainment" },
    { name: "Education" },
    { name: "Politics" },
    { name: "History" },
    { name: "Health" },
    { name: "Music" },
    { name: "Art" },
  ];

  const handleLogout = useLogout().handleLogout;

  const handleClickOnMore = () => {
    setDropDown(!dropDown);
  };

  const handleClickOnMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleClickOnProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNewBlogModal = () => {
    setModalOpen(!modalOpen);
  };

  // const handleClickOnBlogCard = (blog) => {
  //   //setSelectedBlog(blog);
  //   setModalOpen(true);
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickOnSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
    setIsProfileOpen(false);
  };

  const handleClickOnMyBlogs = () => {
    setIsMyBlogs(true);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setDropDown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleBlogSuccess = () => {
      setAlertMessage("Blog creation successful.");
      setAlertType("success");
    };
    window.addEventListener("newBlogSuccess", handleBlogSuccess);
    return () =>
      window.removeEventListener("newBlogSuccess", handleBlogSuccess);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header top-0 z-50 sticky flex flex-row px-6 items-center justify-between bg-thought-50/70 rounded-full backdrop-blur-lg mt-4 mx-4 shadow-lg hover:opacity-100 transition-all duration-400">
        <a
          href="/home"
          className="text-2xl font-bold p-3"
          style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}
        >
          <span className="text-thought-100 ">thought</span>
          <span className="text-hub-100 capitalize">Hub</span>
        </a>

        {/* Navigation Items */}
        <div className="hidden max-lg:text-sm max-md:hidden md:flex items-center justify-between space-x-10">
          {navBarItems.map((item) => (
            <button
              className="cursor-pointer hover:text-thought-100 transition-colors duration-200"
              key={item.name}
            >
              {item.name}
            </button>
          ))}

          <div className="relative">
            <button
              className="cursor-pointer hover:text-thought-100 transition-colors duration-200"
              onClick={handleClickOnMore}
            >
              More
            </button>
            {dropDown && (
              <div
                ref={moreRef}
                className="absolute top-12 right-0 bg-thought-50 p-2 text-left rounded-lg space-y-1 flex flex-col shadow-lg z-20"
              >
                {dropDownItems.map((item) => (
                  <button
                    key={item.name}
                    className="hover:text-thought-100 px-4 py-2 text-left whitespace-nowrap transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="max-md:hidden md:block rounded-xl bg-thought-100 p-2 px-3 justify-center text-white hover:bg-hub-100 transition-all duration-300 ease-linear"
            onClick={handleNewBlogModal}
          >
            {isSmallScreen ? "+" : "+ New Blog"}
          </button>
          <GrUserManager
            className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleClickOnProfile}
          />

          <button
            className="block min-cus-md:hidden text-thought-100"
            onClick={handleClickOnMenu}
          >
            {openMenu ? (
              <GrClose size={24} className="text-thought-100" />
            ) : (
              <GiHamburgerMenu size={24} className="text-thought-100" />
            )}
          </button>
        </div>
      </header>

      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}

      {openMenu && (
        <div
          ref={menuRef}
          className="min-cus-md:hidden w-full fixed top-20 bg-thought-50 p-4 z-50 shadow-lg rounded-3xl max-h-[75vh] overflow-y-auto"
        >
          <div className="flex flex-col space-y-4">
            {navBarItems.map((item) => (
              <button
                key={item.name}
                className="text-left hover:text-thought-100 py-2 px-4 transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-gray-200" />
            {dropDownItems.map((item) => (
              <button
                key={item.name}
                className="text-left hover:text-thought-100 py-2 px-4 transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-gray-200" />
            <button
              className="w-full rounded-xl bg-thought-100 p-2 px-3 text-white hover:bg-hub-100 transition-all duration-300 ease-linear"
              onClick={handleNewBlogModal}
            >
              + New Blog
            </button>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div
          ref={profileRef}
          className="flex flex-col fixed right-5 p-2 space-y-2 max-md:right-14 items-start z-20 bg-thought-50 shadow-lg rounded-lg top-20"
        >
          <a
            className="hover:text-thought-100 cursor-pointer block w-full p-2 transition-colors duration-200"
            onClick={handleClickOnMyBlogs}
          >
            My Blogs
          </a>
          <a
            className="hover:text-thought-100 cursor-pointer block w-full p-2 transition-colors duration-200"
            onClick={handleClickOnSettings}
          >
            Settings
          </a>
          <div className="h-px bg-gray-300 opacity-50 w-full" />
          <a
            className="text-red-800 cursor-pointer hover:text-red-900 block w-full p-2 transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>
      )}

      <div className="flex-grow flex flex-col">
        <div className="fixed inset-0 overflow-hidden z-0">
          <div className="absolute w-[40vw] h-[60vh] -top-[10vh] -left-[10vw] rounded-full bg-thought-100 blur-[80px] opacity-30" />
          <div className="absolute w-[45vw] h-[40vh] top-[30%] -right-[5vw] rounded-full bg-hub-100 blur-[100px] opacity-40" />
          <div className="absolute w-[50vw] h-[50vh] -bottom-[10vh] -left-[5vw] rounded-full bg-thought-200 blur-[90px] opacity-20" />
        </div>

        <div className="relative flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 lg:py-20">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsSearching={setIsSearching}
          />
        </div>

        <div className="relative z-10">
          {isMyBlogs ? (
            <FetchBlogs
              isMyBlogs={isMyBlogs}
              searchQuery={searchQuery}
              isSearching={isSearching}
            />
          ) : (
            <FetchBlogs
              isMyBlogs={false}
              searchQuery={searchQuery}
              isSearching={isSearching}
            />
          )}
        </div>

        {modalOpen && (
          <NewBlogModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}

        <div className="w-full">
          <Footer isModalOpen={modalOpen} />
        </div>
      </div>
    </div>
  );
}

export default Home;
