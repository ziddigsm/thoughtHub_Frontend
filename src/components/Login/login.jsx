import { useState, useEffect } from "react";
import axios from "axios";
import GoogleLoginComponent from "../GoogleLogin/google";
import { FaThumbsUp, FaComment, FaHeart, FaSearch } from "react-icons/fa";

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [footerVisible, setFooterVisible] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);

  const openSignInModal = () => {
    setIsModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsModalOpen(false);
  };

  const fetchBlogs = async () => {
    const blogIds = [21];
    try {
      const blogRequests = blogIds.map((id) =>
        axios.get(`${import.meta.env.VITE_GET_USER_DATA_GO_API + parseInt(id)}`)
      );
      const responses = await Promise.all(blogRequests);
      const blogs = responses.map((response) => {
        return response.data;
      });
      setBlogPosts(blogs.flat());
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = blogPosts.filter((post) =>
    post.blog_data.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRandomDelay = () => `${Math.random() * 0.5 + 0.1}s`;

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      setFooterVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-white font-sans">
      <div className="flex flex-1">
        <header
          className={`${
            isModalOpen ? "blur-sm" : ""
          } bg-white text-[#323232] p-5 w-1/2 flex flex-col items-center justify-center text-center`}
        >
          <div
            className="text-4xl font-bold mb-6"
            style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}
          >
            <span className="text-[#198b91] lowercase">thought</span>
            <span className="text-[#2b3759] capitalize">Hub</span>
          </div>
          <h1 className="text-3xl mb-6 font-semibold">
            A Modern, Minimalist Blog Channel
          </h1>
          <p className="text-xl mb-6 italic text-gray-600">
            Welcome to ThoughtHub, a blog that offers a refreshing take on
            modern topics.
          </p>
          <GoogleLoginComponent isInModal={false} />
        </header>

        <section
          className={`relative w-1/2 bg-[url('src/assets/bg.jpg')] bg-cover bg-center p-12 ${
            isModalOpen ? "blur-sm" : ""
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#ffffff] opacity-100"></div>

          <div className="relative mb-10 flex items-center space-x-2 justify-end z-10">
            <FaSearch className="text-sky-800 text-2xl" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-25 p-2 hover:scale-105 text-lg text-gray-600 rounded-lg bg-[#f8f9fa] border-2 border-black outline-none transition-transform"
            />
            <button className="bg-black text-white px-4 py-2 text-lg rounded-lg hover:bg-gray-800">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-5 justify-around mt-20 z-10">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.blog_data.id}
                  style={{
                    animation: `slideInBounce 2s ease-out forwards`,
                    animationDelay: getRandomDelay(),
                  }}
                  className="relative mb-6 overflow-hidden rounded-3xl shadow-xl w-[calc(50%-20px)] h-[300px] cursor-pointer group transform hover:scale-110 transition-transform ease-in-out"
                  onClick={openSignInModal}
                >
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="relative h-full w-full">
                      <img
                        src={`data:image/png;base64,${post.blog_data.blog_image}`}
                        alt={post.blog_data.title}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-500 opacity-80 group-hover:brightness-50"
                      />
                      <div className="absolute text-2xl text-slate-200 font-bold inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-40 group-hover:opacity-100 transition-opacity duration-500 p-4">
                        <h1>{post.blog_data.title}</h1>
                      </div>
                      <div className="absolute top-5 right-5 flex items-center space-x-3 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        <div className="flex items-center space-x-1">
                          <FaHeart className="text-red-500" />{" "}
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaComment className="text-blue-300" />{" "}
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 p-10 w-3/4 bg-teal-50 rounded-3xl shadow-lg transition-all duration-500 ease-in-out">
                        <h2 className="text-gray-800 font-bold text-xl text-center">
                          {post.blog_data.title}
                        </h2>
                        <p className="text-gray-600 text-center mt-2 text-base">
                          {post.blog_data.content}
                        </p>
                        <a
                          href="#"
                          className="text-center hover:underline mt-3 block text-[#198b91] text-lg"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No blog posts found.</p>
            )}
          </div>
        </section>
      </div>

      <footer
        className={`${
          isModalOpen ? "blur-sm" : ""
        } bg-black text-white text-center p-10 ${
          footerVisible ? "animate-slideInFromLeft" : "opacity-0"
        }`}
        style={{
          animation: footerVisible
            ? "slideInFromLeft 1.5s ease-out forwards"
            : "",
          animationDelay: "0.5s",
        }}
      >
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold mb-4">
            &copy; 2024 ThoughtHub. All rights reserved.
          </p>
          <div className="flex space-x-8 mb-6">
            <a href="#" className="text-gray-300 hover:text-white">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              About Us
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Contact
            </a>
          </div>
          <div className="flex space-x-5 mb-6">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaThumbsUp size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaComment size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaHeart size={20} />
            </a>
          </div>
          <div className="text-sm text-gray-400">
            <p>1234 Blog Street, Content City, CT 45678</p>
            <p>Email: info@thoughthub.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white opacity-0 animate-popIn p-10 rounded-3xl shadow-lg text-center w-3/4 max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 text-2xl font-bold"
              onClick={closeSignInModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Sign in to ThoughtHub
            </h2>
            <p className="text-gray-600 font mb-6">
              You must be signed in to access the blog. Please sign in using
              your Google account.
            </p>
            <GoogleLoginComponent isInModal={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
