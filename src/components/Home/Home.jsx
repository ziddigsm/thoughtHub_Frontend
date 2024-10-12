import React, { useState } from 'react';
import GoogleLoginComponent from './google';
import { FaThumbsUp, FaComment, FaHeart, FaSearch } from 'react-icons/fa';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  const openSignInModal = () => {
    setIsModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsModalOpen(false);
  };

  const blogPosts = [
    { id: 1, title: "The Future of AI", content: "This is blog post 1.", description: "Exploring AI advancements and their impact on the future.", image: "src/assets/Technology.jpg" },
    { id: 2, title: "Discovering Hidden Wonders", content: "This is blog post 2.", description: "Join us on a journey to uncover the world's hidden natural wonders.", image: "src/assets/nature.jpg" },
    { id: 3, title: "Finance Tips for 2024", content: "This is blog post 3.", description: "Smart finance tips to keep you on track in 2024.", image: "src/assets/finance.jpg" },
    { id: 4, title: "Science of Well-being", content: "This is blog post 4.", description: "The science behind maintaining physical and mental health.", image: "src/assets/health.jpg" },
    { id: 5, title: "Breathtaking Travel Destinations", content: "This is blog post 5.", description: "Top travel destinations to visit for an unforgettable experience.", image: "src/assets/travel.jpg" },
    { id: 6, title: "Chef's Choice", content: "This is blog post 6.", description: "Discover the finest culinary delights recommended by top chefs.", image: "src/assets/Cooking.jpg" },
  ];
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#2b3759] text-white font-sans">
      <div className="flex flex-1">
        <header className={`${isModalOpen ? "blur-sm" : ""} bg-white text-[#323232] p-5 w-1/2 flex flex-col items-center justify-center text-center`}>
        <div className="text-4xl font-bold mb-6" style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}>
          <span className="text-[#198b91] lowercase">thought</span>
          <span className="text-[#2b3759] capitalize">Hub</span>
        </div>

          <h1 className="text-3xl mb-6 font-semibold">A Modern, Minimalist Blog Channel</h1>
          <p className="text-xl mb-6 italic text-gray-600">Welcome to ThoughtHub, a blog that offers a refreshing take on modern topics.</p>
          <GoogleLoginComponent isInModal={false} />
        </header>

        <section className={`relative w-1/2 bg-[#367bb3] p-12 ${isModalOpen ? "blur-sm" : ""}`}>
        <div className="relative mb-10 flex items-center space-x-2 justify-end">
            <FaSearch className="text-white text-2xl" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-50 p-2 text-lg text-gray-600 rounded-lg bg-[#f8f9fa] border-2 border-black outline-none"
            />
            <button className="bg-black text-white px-4 py-2 text-lg rounded-lg hover:bg-gray-800">Search</button>
          </div>

          <div className="flex flex-wrap gap-5 justify-around mt-20">
  {filteredPosts.length > 0 ? (
    filteredPosts.map((post) => (
      <div
        key={post.id}
        className="relative mb-6 bg-white overflow-hidden rounded-lg shadow-xl w-[calc(50%-20px)] h-[300px] cursor-pointer flex flex-col items-center transition-transform transform duration-200 delay-50 hover:scale-110 hover:bg-[#c7ecee]"
        onClick={openSignInModal}
      >
        <div className="relative w-full h-36 mb-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover rounded-t-lg brightness-50 hover:brightness-100 transition duration-300"
          />
          <div className="absolute inset-1 flex justify-center items-start space-x-5 ml-80 text-white text-xl">
            <div className="flex items-center space-x-1">
              <FaHeart className="text-red-500" /> <span>10</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComment className="text-blue-300" /> <span>3</span>
            </div>
          </div>
        </div>
        <h3 className="text-gray-800 text-xl text-center">{post.title}</h3>
        <p className="text-gray-600 text-center px-4 mt-2 text-sm">{post.description}</p>
      </div>
    ))
  ) : (
    <p>No blog posts found.</p>
  )}
</div>
        </section>
      </div>

      <footer className={`${isModalOpen ? "blur-sm" : ""} bg-white text-gray-700 text-center p-5`}>
        <p>&copy; 2024 ThoughtHub. All rights reserved.</p>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-3/4 max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 text-2xl font-bold"
              onClick={closeSignInModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4  text-black">Sign in to ThoughtHub</h2>
            <p className="text-gray-600 mb-6">
              You must be signed in to access the blog. Please sign in using your Google account.
            </p>
            <GoogleLoginComponent isInModal={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
