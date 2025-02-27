import { useState, useEffect } from "react";
import axios from "axios";
import GoogleLoginComponent from "../GoogleLogin/google";
import { FaSearch, FaHeart, FaComment } from "react-icons/fa";
import Footer from "../Footer/Footer";
import LoadingSpinner from "./loadingSpinner";
import { limitOffsetForLoginPage } from "../../utils/constants";

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    const blogId = 0;
    setIsLoading(true);
    setError(null);
    try {
      const blogRequest = axios.get(
        `${import.meta.env.VITE_GET_BLOG_DATA_GO_API + parseInt(blogId) + limitOffsetForLoginPage}`
      );
      const responses = await Promise.all([blogRequest]);
      console.log('API Response:', responses); // For debugging

      // Validate and clean the blog data
      const blogs = responses
        .map((response) => response.data?.blogs)
        .flat()
        .filter(post => post && post.blog_data && post.blog_data.id); // Ensure required fields exist

      if (blogs.length === 0) {
        setError("No blog posts found");
        return;
      }

      setBlogPosts(blogs);
      setFilteredPosts(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
      setError("Failed to fetch blog posts. Please try again later.");
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
        setActiveSection("hero");
      } else {
        setActiveSection("content");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const searchPosts = () => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) {
        setFilteredPosts(blogPosts);
        return;
      }

      const filtered = blogPosts.filter((post) => {
        if (!post?.blog_data) return false;
        const title = post.blog_data.title?.toLowerCase() || '';
        const content = post.blog_data.content?.toLowerCase() || '';
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
      behavior: "smooth",
    });
  };

  const closeSignInModal = () => {
    setIsModalOpen(false);
  };

  const renderBlogPost = (post) => {
    if (!post?.blog_data) return null;

    return (
      <div
        key={post.blog_data.id}
        className="flex-grow group relative overflow-hidden rounded-2xl bg-white transition-all duration-500 hover:scale-105 shadow-xl cursor-pointer hover:shadow-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-[4/3] overflow-hidden">
          {post.blog_data.blog_image && (
            <img
              src={`data:image/png;base64,${post.blog_data.blog_image}`}
              alt={post.blog_data.title || 'Blog post image'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'path/to/fallback/image.jpg'; // Add a fallback image path
                e.target.alt = 'Failed to load image';
              }}
            />
          )}
        </div>
        <div className="p-6 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-thought-100 to-hub-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <h2 className="text-2xl font-semibold mb-3 line-clamp-1">
            {post.blog_data.title || 'Untitled'}
          </h2>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {post.blog_data.content || 'No content available'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FaHeart className="w-4 h-4 mr-1 text-red-500" />
                {post.likes || 0}
              </span>
              <span className="flex items-center">
                <FaComment className="w-4 h-4 mr-1 text-blue-500" />
                {post.comments?.length || 0}
              </span>
            </div>
            <span className="text-sm font-medium text-black group-hover:translate-x-1 transition-transform duration-300">
              Read more →
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-black font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-thought-100/10 to-hub-100/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-thought-100/10 to-hub-100/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-gray-100/50" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-thought-100/10 rotate-45 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-2 border-hub-100/10 rotate-12 transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 z-50">
        <div
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={`${isModalOpen ? "blur-sm" : ""} transition-all duration-300 relative z-10`}>
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-40 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div
                className="text-4xl font-bold relative"
                style={{ textShadow: "4px 9px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <span className="text-[#198b91] lowercase">thought</span>
                <span className="text-[#2b3759] capitalize">Hub</span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-thought-100 to-hub-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
              <div className="flex items-center space-x-4">
                <GoogleLoginComponent isInModal={false} />
              </div>
            </div>
          </div>
        </nav>

        <section
          className={`min-h-screen pt-24 px-4 flex flex-col justify-center items-center text-center transition-opacity duration-700 relative ${
            activeSection === "hero" ? "opacity-100" : "opacity-50"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl p-1 font-bold tracking-tight max-w-4xl mb-8 bg-gradient-to-r from-thought-100 to-hub-100 bg-clip-text text-transparent animate-gradient">
            Welcome to Thoughthub.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Experience a new way of sharing ideas. Clean, minimal, and focused
            on what matters most — your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Explore Stories
            </button>
            <button
              className="px-8 py-4 bg-gray-100 text-black rounded-full text-lg font-medium hover:bg-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => setIsModalOpen(true)}
            >
              Start Writing
            </button>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className={`w-full max-w-2xl transform transition-all duration-300 ${
              isSearchFocused ? "scale-105" : "scale-100"
            }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for stories..."
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-lg focus:border-black focus:ring-2 focus:ring-black/5 transition-all duration-300 shadow-lg"
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

        <section
          className={`min-h-screen px-4 py-24 transition-opacity duration-700 relative ${
            activeSection === "content" ? "opacity-100" : "opacity-50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold">
                  {filteredPosts.length === 0
                    ? `No results found for "${searchQuery}"`
                    : `Search results for "${searchQuery}"`}
                </h2>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                <LoadingSpinner />
              ) : filteredPosts.length === 0 && searchQuery ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No matching stories found. Try a different search term.
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => renderBlogPost(post))
              )}
            </div>
          </div>
        </section>

        <Footer isModalOpen={isModalOpen} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
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
            <p className="text-gray-600 mb-6">
              You must be signed in to access the blog. Please sign in using
              your Google account.
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