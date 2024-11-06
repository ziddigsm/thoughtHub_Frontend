import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GrClose, GrSearch, GrUserManager } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Home.css";
import { useLogout } from "../../contexts/useLogout";
import {Shimmer} from "./shimmer";
import { NewBlogModal } from "../Blog/newblog";

function Home() {
  const [dropDown, setDropDown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header top-0 z-50 sticky flex flex-row px-6 items-center justify-between bg-thought-50 rounded-full m-4 shadow-lg opacity-85 hover:opacity-100 transition-opacity duration-400">
        <a
          href="/home"
          className="text-xl font-bold p-4"
          style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}
        >
          <span className="text-thought-100 lowercase">thought</span>
          <span className="text-hub-100 capitalize">Hub</span>
        </a>
        <div className="hidden max-md:hidden md:flex items-center justify-between space-x-10">
          {navBarItems.map((item) => (
            <button
              className="cursor-pointer hover:text-thought-100"
              key={item.name}
            >
              {item.name}
            </button>
          ))}

          <div className="relative">
            <button
              className="cursor-pointer hover:text-thought-100"
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
                    className="hover:text-thought-100 px-4 py-2 text-left whitespace-nowrap"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:block rounded-xl bg-thought-100 p-2 px-3 justify-center text-white hover:bg-hub-100 transition-all duration-300 ease-linear" onClick={handleNewBlogModal}>
            {isSmallScreen ? "+" : "+ New Blog"}
          </button>
          <GrUserManager
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={handleClickOnProfile}
          />

          <button
            className="md:hidden text-thought-100"
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

      {openMenu && (
        <div
          ref={menuRef}
          className="md:hidden w-full fixed top-20 bg-thought-50 p-4 z-50 shadow-lg rounded-3xl max-h-[75vh] overflow-y-auto"
        >
          <div className="flex flex-col space-y-4">
            {navBarItems.map((item) => (
              <button
                key={item.name}
                className="text-left hover:text-thought-100 py-2 px-4"
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-gray-200" />
            {dropDownItems.map((item) => (
              <button
                key={item.name}
                className="text-left hover:text-thought-100 py-2 px-4"
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-gray-200" />
            <button className="w-full rounded-xl bg-thought-100 p-2 px-3 text-white hover:bg-hub-100 transition-all duration-300 ease-linear" onClick={handleNewBlogModal}>
              + New Blog
            </button>
          </div>
        </div>
      )}
      {isProfileOpen && (
        <div
          ref={profileRef}
          className="flex flex-col  fixed right-5 p-2 space-y-2 max-md:right-14 items-start z-20 bg-thought-50 shadow-lg rounded-lg top-20 "
        >
          <a
            className="hover:text-thought-100 cursor-pointer block w-full p-2"
            onClick={handleClickOnSettings}
          >
            My Blogs
          </a>
          <a
            className="hover:text-thought-100 cursor-pointer block w-full p-2"
            onClick={handleClickOnSettings}
          >
            Settings
          </a>
          <div className="h-px bg-gray-300 opacity-50 w-full" />
          <a
            className="text-red-800 cursor-pointer hover:text-red-900 block w-full p-2"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>
      )}
      <div className="relative flex-grow">
        <div
          className="absolute inset-1 bg-cover bg-center rounded-lg m-3 bg-[url('src/assets/bg.jpg')]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#ffffff] opacity-100 z-0"></div>
        <div className="relative flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 lg:py-20">
          <SearchBar />
        </div>
        <div className='relative z-10'>
          <Shimmer />
        </div>

        {modalOpen && <NewBlogModal isOpen={modalOpen} onClose = {()=>setModalOpen(false)}/>}
      </div>
    </div>
  );
}

function SearchBar() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="search-bar flex flex-row items-center p-2 rounded-full bg-thought-50 backdrop-blur-sm shadow-lg">
        <GrSearch className="ml-3 text-thought-200" />
        <input
          className="search-input flex-grow px-4 py-2 rounded-full bg-transparent focus:outline-none placeholder-gray-500"
          placeholder="Search for blogs"
        />
        <button className="p-1 px-4 py-2 max-md:p-0 max-md:w-10 max-md:h-10 bg-thought-100 rounded-full text-white hover:bg-hub-100 transition-colors duration-200 flex items-center justify-center">
          {!isSmallScreen ? "Search" : <GrSearch className="text-white" />}
        </button>
      </div>
    </div>
  );
}

export default Home;
