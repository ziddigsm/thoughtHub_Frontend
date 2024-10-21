import img from "../../assets/bg.jpg";
import { useState } from "react";
import { GrClose } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';

function Home() {
  const [dropDown, setDropDown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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

  return (
    <>
      <div className="header flex flex-row px-6 items-center justify-between bg-thought-50 rounded-full m-4">
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

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block rounded-xl bg-thought-100 p-2 px-3 justify-center text-white hover:bg-hub-100 transition-all duration-300 ease-linear">
            + New Blog
          </button>
          <img src={img} alt="user" className="w-10 h-10 rounded-full" />
          
          {/* Hamburger Menu Button */}
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

      {/* Mobile Menu */}
      {openMenu && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-thought-50 p-4 z-50 shadow-lg">
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
    </>
  );
}

export default Home;