import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { GrSearch } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { useLogout } from "../../contexts/useLogout";
import { NewBlogModal } from "../Blog/newblog";
import Footer from "../Footer/footer";
import { FetchBlogs } from "../Blog/blog";
import { useAlertContext } from "../../contexts/alertContext";
import { BlogModal } from "../Blog/blogmodal";
import axios from "axios";

function SearchBar({ searchQuery, setSearchQuery, setIsSearching }) {
  //add isSmallScreen state here for navbar
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef(null);

  //add useEffect to handle resize here

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
  // add states for categories section handling from notes
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMyBlogs, setIsMyBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { showAlert } = useAlertContext();
  const [newBlogModalOpen, setNewBlogModalOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [modalBlogData, setModalBlogData] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userData"))?.user_id;

  // add navbar categories items here

  const queryParams = new URLSearchParams(window.location.search);
  const blogIdFromUrl = queryParams.get("blog_id");
  let apiKey = "VITE_API_KEY_" + new Date().getDay();

  // Check for recommended blog data in localStorage if ID exists in URL
  useEffect(() => {
    if (blogIdFromUrl) {
      const blogData = localStorage.getItem("selectedRecommendedBlog");
      if (blogData) {
        const parsed = JSON.parse(blogData);
        if (parsed.blog_data?.id.toString() === blogIdFromUrl) {
          setModalBlogData(parsed);
          setModalOpen(true);
          localStorage.removeItem("selectedRecommendedBlog");
        }
      }
    }
  }, [blogIdFromUrl]);

  //to check if user has liked the opened blog
  const userHasLikedCheck = async (blogId) => {
    try {
      let baseUrl = import.meta.env.VITE_USER_HAS_LIKED_BLOG_API;
      baseUrl += `${blogId}&user_id=${userId}`;
      console.log(baseUrl);
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": import.meta.env[apiKey],
        },
      });
      if (response.status === 200) {
        setHasLiked(response.data.has_liked);
      } else {
        setHasLiked(false);
      }
    } catch (err) {
      console.error("Error checking like status:", err);
      setHasLiked(false);
    }
  };

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (modalOpen && modalBlogData?.blog_data?.id) {
        await userHasLikedCheck(modalBlogData.blog_data.id);
        console.log(
          "Checking like status for blog:",
          modalBlogData.blog_data.id
        );
      }
    };
    checkLikedStatus();
  }, [modalOpen, modalBlogData?.blog_data?.id]);

  const handleLogout = useLogout().handleLogout;

  const handleClickOnProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNewBlogModal = () => {
    setNewBlogModalOpen(true);
  };

  // add handle and useEffect methods to handle resize and more clicks

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
      // add if conditions for opening menus and closing them/dropdowns
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
      showAlert("Blog created successfully!", "success");
    };
    window.addEventListener("newBlogSuccess", handleBlogSuccess);
    return () =>
      window.removeEventListener("newBlogSuccess", handleBlogSuccess);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header top-0 z-50 sticky flex flex-row px-6 max-sm:px-3 items-center justify-between bg-thought-50/70 rounded-full backdrop-blur-lg mt-4 mx-4 shadow-lg hover:opacity-100 transition-all duration-400">
        <a
          href="/home"
          className="text-2xl font-bold py-3 pr-3"
          style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}
        >
          <span className="text-thought-100 ">Thought</span>
          <span className="text-hub-100 capitalize">Hub</span>
        </a>

        {/* Navigation Items */}

        <div className="flex items-center space-x-3">
          <button
            className=" max-xs:text-xs md:block rounded-xl bg-thought-100 p-2 px-3 justify-center text-white hover:bg-hub-100 text-nowrap transition-all duration-300 ease-linear"
            onClick={handleNewBlogModal}
          >
            + New Blog
          </button>
          <FaUserCircle
            className="w-10 h-10 bg-thought-100 text-white border-none rounded-full  cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleClickOnProfile}
          />

          {/* Hamburger menu button comes here */}
        </div>
      </header>

      {/*the dropdown menu code for mobile screens*/}

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

      {modalOpen && modalBlogData && (
        <BlogModal
          blog={modalBlogData}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setHasLiked(false);
            localStorage.removeItem("selectedRecommendedBlog");
          }}
          onAddComment={() => {}}
          onBlogDelete={() => {}}
          hasLiked={hasLiked}
          setHasLiked={setHasLiked}
        />
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

        {newBlogModalOpen && (
          <NewBlogModal
            isOpen={newBlogModalOpen}
            onClose={() => setNewBlogModalOpen(false)}
          />
        )}

        <div className="w-full">
          <Footer isModalOpen={newBlogModalOpen} />
        </div>
      </div>
    </div>
  );
}

export default Home;
