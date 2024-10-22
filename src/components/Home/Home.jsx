import img from "../../assets/bg.jpg";
import { useState, useRef, useEffect } from "react";
import { GrClose, GrSearch } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Home.css';

function Home() {
  const [dropDown, setDropDown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const menuRef = useRef(null);

  const navBarItems = [
    { name: "Tech" }, 
    { name: "Travel" }, 
    { name: "Business" }, 
    { name: "Science" }, 
    { name: "Cooking" }
  ];

  const dropDownItems = [
    { name: "Entertainment" }, 
    { name: "Education" }, 
    { name: "Politics" }, 
    { name: "History" }, 
    { name: "Health" }, 
    { name: "Music" }, 
    { name: "Art" }
  ];

  const handleClickOnMore = () => {
    setDropDown(!dropDown);
  };

  const handleClickOnMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="header flex flex-row px-6 items-center justify-between bg-thought-50 rounded-full m-4 shadow-lg">
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
            <button className="cursor-pointer hover:text-thought-100" key={item.name}>
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
              <div className="absolute top-12 right-0 bg-thought-50 p-2 text-left rounded-lg space-y-1 flex flex-col z-10 shadow-lg">
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
          <button className="hidden md:block rounded-xl bg-thought-100 p-2 px-3 justify-center text-white hover:bg-hub-100 transition-all duration-300 ease-linear">
            {isSmallScreen ? '+' : '+ New Blog'}
          </button>
          <img src={img} alt="user" className="w-10 h-10 rounded-full" />

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
      </div>

      {openMenu && (
        <div 
          ref={menuRef}
          className="md:hidden fixed top-20 right-4 bg-thought-50 p-4 z-50 shadow-lg rounded-3xl max-h-[calc(100vh-20rem)] overflow-y-auto"
          style={{ maxWidth: '100vw-20rem' }}
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
            <button className="w-full rounded-xl bg-thought-100 p-2 px-3 text-white hover:bg-hub-100 transition-all duration-300 ease-linear">
              + New Blog
            </button>
          </div>
        </div>
      )}

      <div className="relative flex-grow">
        <div 
          className="absolute inset-1 bg-cover bg-center rounded-lg m-5"
          style={{ 
            backgroundImage: "url('src/assets/bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#ffffff] opacity-100 z-0"></div>
        <div className="relative flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 lg:py-20">
          <SearchBar />
        </div>
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

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
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
          {!isSmallScreen ? 'Search' : (
            <GrSearch className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Home;