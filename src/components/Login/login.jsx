import { useState, useEffect } from "react";
import axios from "axios";
import GoogleLoginComponent from "../GoogleLogin/google";
import { FaSearch, FaHeart, FaComment } from "react-icons/fa";
import Footer from "../Footer/Footer";
import LoadingSpinner from "./LoadingSpinner";
import {limitOffsetForLoginPage} from "../../utils/constants"

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchBlogs = async () => {
    const blogIds = [0];
    setIsLoading(true);
    try {
      const blogRequests = blogIds.map((id) =>
        axios.get(`${import.meta.env.VITE_GET_BLOG_DATA_GO_API + parseInt(id) + limitOffsetForLoginPage} `)
      );
      const responses = await Promise.all(blogRequests);
      const blogs = responses.map((response) => response.data?.blogs);
      setBlogPosts(blogs.flat());
      setFilteredPosts(blogs.flat()); 
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      const progress = (scrolled / (fullHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      if (scrolled < windowHeight * 0.5) {
        setActiveSection('hero');
      } else {
        setActiveSection('content');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const searchPosts = () => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) {
        setFilteredPosts(blogPosts); 
        return;
      }

      const filtered = blogPosts.filter((post) => {
        const title = post.blog_data.title.toLowerCase();
        const content = post.blog_data.content.toLowerCase();
        return title.includes(query) || content.includes(query);
      });

      setFilteredPosts(filtered);
    };

    searchPosts();
  }, [searchQuery, blogPosts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.scrollTo({ 
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  };

  const closeSignInModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-black font-sans overflow-x-hidden">
      <div 
        className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 z-50"
      >
        <div 
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className={`${isModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>

      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div
            className="text-4xl font-bold "
            style={{ textShadow: "4px 9px 10px rgba(0, 0, 0, 0.2)" }}
          >
            <span className="text-[#198b91] lowercase">thought</span>
            <span className="text-[#2b3759] capitalize">Hub</span>
          </div>
            <div className="flex items-center space-x-4">
              <GoogleLoginComponent isInModal={false} />
            </div>
          </div>
        </div>
      </nav>

      <section className={`min-h-screen pt-24 px-4 flex flex-col justify-center items-center text-center transition-opacity duration-700 ${
        activeSection === 'hero' ? 'opacity-100' : 'opacity-50'
      }`}>
    
        <h1 className="text-4xl sm:text-5xl md:text-7xl p-1 font-bold tracking-tight max-w-4xl mb-8 bg-gradient-to-r from-thought-100 to-hub-100 bg-clip-text text-transparent ">
          Welcome to Thoughthub.
        </h1>  
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
          Experience a new way of sharing ideas. Clean, minimal, and focused on what matters most — your content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} 
            className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-900 transition-all duration-300">
            Explore Stories
          </button>
          <button 
            className="px-8 py-4 bg-gray-100 text-black rounded-full text-lg font-medium hover:bg-gray-200 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
            
          >
            Start Writing

          </button>
        </div>

        <form 
          onSubmit={handleSearchSubmit} 
          className={`w-full max-w-2xl transform transition-all duration-300 ${
            isSearchFocused ? 'scale-105' : 'scale-100'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for stories..."
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-lg focus:border-black focus:ring-2 focus:ring-black/5 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <FaSearch className="text-gray-400 w-5 h-5" />
            </button>
          </div>
        </form>
      </section>

      <section className={`min-h-screen px-4 py-24 transition-opacity duration-700 ${
        activeSection === 'content' ? 'opacity-100' : 'opacity-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          {searchQuery && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                {filteredPosts.length === 0 
                  ? `No results found for "${searchQuery}"`
                  : `Search results for "${searchQuery}"`
                }
              </h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredPosts.length === 0 && searchQuery ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No matching stories found. Try a different search term.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.blog_data.id}
                  className="flex-grow group relative overflow-hidden rounded-2xl bg-slate-100 transition-all duration-500 hover:scale-110 shadow-xl cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`data:image/png;base64,${post.blog_data.blog_image}`}
                      alt={post.blog_data.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-3 line-clamp-1">
                      {post.blog_data.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.blog_data.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaHeart className="w-4 h-4 mr-1 text-red-500" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <FaComment className="w-4 h-4 mr-1 text-blue-500" />
                          {post.comments?.length || 0}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-black">Read more →</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      
      <Footer isModalOpen={isModalOpen} />
    </div>
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black   bg-opacity-70 z-50">
          <div className="bg-white opacity-0 animate-popIn p-10 rounded-3xl shadow-lg text-center w-3/4 max-w-md relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition duration-200" 
              onClick={closeSignInModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Sign in to ThoughtHub
            </h2>
            <p className="text-gray-600 font mb-6">
              You must be signed in to access the blog. Please sign in using your Google account.
            </p>
            <div className="flex justify-center">
              <GoogleLoginComponent isInModal={true} />
            </div>
          </div>
        </div>
      )}
  </div>
  );
}

export default Login;