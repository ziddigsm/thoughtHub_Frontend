import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FaComment,
  FaClock,
  FaCheckCircle,
  FaHeart,
  FaFacebook,
  FaLinkedin,
  FaCopy,
  FaRobot,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useAlertContext } from "../../contexts/alertContext";
import { useModal } from "../../contexts/warningContext";

export function BlogModal({
  blog,
  isOpen,
  onClose,
  onAddComment,
  onBlogDelete,
}) {
  const modalRef = useRef(null);
  const { showWarning } = useModal();
  const [showFullHeader, setShowFullHeader] = useState(false);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Scroll the modal into view when it opens
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      // Lock the body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setShowFullHeader(window.innerWidth >= 640); // 640px is the 'sm' breakpoint
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData ? userData.user_id : null;

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [readTime, setReadTime] = useState(0);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlertContext();

  useEffect(() => {
    const wordCount = blog.blog_data.content.split(/\s+/).length;
    setReadTime(Math.ceil(wordCount / 225));
  }, [blog.blog_data.content]);

  if (!isOpen) return null;

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    onAddComment(newComment);
    setNewComment("");
  };

  const handleQuickScribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const summarizeUrl = import.meta.env.VITE_SUMMARIZE_API;
      if (!summarizeUrl) {
        throw new Error("Summarize API URL is not defined.");
      }
      const response = await axios.post("/api/summarize", {
        body: JSON.stringify({ text: blog.blog_data.content }),
      });
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = JSON.parse(response?.data?.body);
      setSummary(data.summary);
      setActiveTab("summary");
    } catch {
      setError("Failed to generate summary. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = () => {
    showWarning(
      "Are you sure you want to delete this blog? This action cannot be undone.",
      handleDeleteConfirmation
    );
  };

  const handleDeleteConfirmation = async () => {
    try {
      const deleteBlogAPI = `${import.meta.env.VITE_DELETE_BLOG_GO_API}${
        blog.blog_data.id
      }&userId=${userId}`;
      const deleteResponse = await axios.delete(deleteBlogAPI);

      if (deleteResponse.status === 200) {
        onBlogDelete(blog.blog_data.id);

        showAlert("Blog deleted successfully.", "success");

        onClose();
      }
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Could not delete blog.",
        "error"
      );
    }
  };

  const tabs = [
    "content",
    "comments",
    "about",
    ...(summary ? ["summary"] : []),
  ];

  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedText = encodeURIComponent(
    `${blog.blog_data.title} - Check out this blog!`
  );
  const socialUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
  const handleSharing = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Function to toggle expanded header on mobile
  const toggleHeaderExpansion = () => {
    if (window.innerWidth < 640) {
      setShowFullHeader(!showFullHeader);
    }
  };

  return (
    <div
      className="fixed z-50 w-full flex justify-center"
      style={{
        top: "100px", 
        bottom: "0",
        left: "0",
        right: "0",
        overflowY: "auto",
      }}
    >
      <div
        className="fixed inset-0 cursor-pointer bg-gradient-to-b from-transparent via-gray-900/60 to-transparent backdrop-blur-sm"
        onClick={onClose}
        style={{ top: "100px" }}
      ></div>

      <div
        ref={modalRef}
        className="relative w-full max-w-4xl mx-2 sm:mx-4 my-2 sm:my-4 bg-white/95 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 120px)" }} 
      >
        {/* Compact Header for Mobile */}
        <div className="bg-white/90 border-b border-gray-200 p-2 sm:p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Title and minimal info */}
              <div className="flex items-center justify-between">
                <h1 
                  className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight mb-0 sm:mb-2 truncate max-w-[80%] sm:max-w-full"
                  onClick={toggleHeaderExpansion}
                >
                  {blog.blog_data.title}
                </h1>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-full sm:p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Mobile view - minimal info by default */}
              <div className={`sm:flex items-center gap-1 sm:gap-2 md:space-x-4 text-gray-600 text-xs sm:text-sm md:text-base ${showFullHeader ? 'flex' : 'hidden sm:flex'}`}>
                <div className="flex items-center space-x-1 sm:space-x-3 mt-1 sm:mt-0">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Author"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="font-normal md:font-medium">
                      {blog.blog_data.name}
                    </span>
                    <div className="text-xs flex items-center text-gray-500">
                      <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                      <span className="hidden sm:inline">Verified Author</span>
                    </div>
                  </div>
                </div>
                <span className="opacity-30 hidden sm:inline">•</span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FaClock className="text-gray-400 text-xs" />
                  <span>{readTime} min</span>
                </div>
                <span className="opacity-30 hidden sm:inline">•</span>
                <MdDelete
                  className="text-thought-100 hover:text-hub-100 cursor-pointer size-5 sm:size-6 md:size-7"
                  onClick={handleDeleteBlog}
                />
              </div>
              
              {/* Mobile-only toggle indicator */}
              <div 
                className="sm:hidden mt-1 mb-0 flex justify-center cursor-pointer"
                onClick={toggleHeaderExpansion}
              >
                <div className="h-1 w-10 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <div key={tab} className="group relative flex-1">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full py-1 sm:py-2 md:py-4 text-center uppercase tracking-wide text-xs sm:text-sm font-medium sm:font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:bg-gray-100"
                } ${
                  tab === "comments" || tab === "about"
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                {tab}
              </button>

              {/* Hover Message for "comments" and "about" tabs */}
              {(tab === "comments" || tab === "about") && (
                <div className="absolute hidden group-hover:block z-50 bg-thought-75 text-hub-100 text-xs p-2 rounded mt-2 top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  Coming soon
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4 md:p-6 bg-white overflow-y-auto max-h-[calc(100vh-300px)]">
          {activeTab === "content" && (
            <div>
              <div className="relative mb-4 sm:mb-6 md:mb-8 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg">
                <img
                  src={
                    blog.blog_data.blog_image
                      ? `data:image/png;base64,${blog.blog_data.blog_image}`
                      : "https://via.placeholder.com/800x400"
                  }
                  alt={blog.blog_data.title}
                  className="w-full h-[200px] sm:h-[300px] md:h-[450px] object-cover"
                />
              </div>

              <article className="prose max-w-none text-gray-800 text-sm sm:text-base">
                <div
                  dangerouslySetInnerHTML={{ __html: blog.blog_data.content }}
                />
              </article>

              <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 sm:gap-4">
                <div className="flex space-x-3 sm:space-x-4 md:space-x-6 text-gray-600">
                  <button
                    href="#"
                    className="hover:text-blue-600 transition-all duration-200"
                  >
                    <FaFacebook
                      size={20}
                      className="sm:size-5 md:size-6"
                      onClick={() => handleSharing(socialUrls.facebook)}
                    />
                  </button>
                  <button
                    href="#"
                    className="hover:text-black transition-all duration-200"
                  >
                    <FaXTwitter
                      size={20}
                      className="sm:size-5 md:size-6"
                      onClick={() => handleSharing(socialUrls.twitter)}
                    />
                  </button>
                  <button
                    href="#"
                    className="hover:text-blue-700 transition-all duration-200"
                  >
                    <FaLinkedin
                      size={20}
                      className="sm:size-5 md:size-6"
                      onClick={() => handleSharing(socialUrls.linkedin)}
                    />
                  </button>
                  <button className="hover:text-thought-100 transition-all duration-200">
                    <FaCopy
                      size={18}
                      className="sm:size-4 md:size-5"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showAlert("Link copied to clipboard!", "info");
                      }}
                    />
                  </button>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <FaHeart size={16} className="text-red-500" />
                    <span className="text-sm">{blog.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <FaComment size={16} className="text-blue-400" />
                    <span className="text-sm">{blog.comments?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* QuickScribe Button */}
              <div className="mt-4 sm:mt-6 md:mt-8 text-center">
                <button
                  onClick={handleQuickScribe}
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-thought-100 to-hub-100 text-white py-2 px-4 sm:py-2 sm:px-5 md:py-3 md:px-6 rounded-full flex items-center justify-center mx-auto space-x-1 sm:space-x-2 hover:from-thought-100/90 hover:to-hub-100/90 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaRobot size={14} className="sm:size-4 md:size-5" />
                  <span className="text-xs sm:text-sm md:text-base">
                    {isLoading ? "Generating..." : "QuickScribe"}
                  </span>
                </button>
                {error && <p className="mt-2 text-red-500 text-xs sm:text-sm">{error}</p>}
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Article Summary</h2>
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg prose max-w-none text-sm sm:text-base">
                {summary}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              {blog.comments && blog.comments.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {blog.comments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-200 pb-2 sm:pb-3 md:pb-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                        <img
                          src="https://via.placeholder.com/40"
                          alt="Commenter"
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border border-gray-200"
                        />
                        <div>
                          <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                            {comment.name}
                          </span>
                          <div className="text-tiny sm:text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6 md:py-8 text-gray-500 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )}

              <div className="mt-3 sm:mt-4 md:mt-6">
                <textarea
                  className="w-full p-2 sm:p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-xs sm:text-sm md:text-base"
                  rows="3"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Share your thoughts..."
                ></textarea>
                <button
                  onClick={handleCommentSubmit}
                  className="mt-2 sm:mt-3 md:mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base"
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 md:space-x-6 lg:space-x-8 bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl">
              <img
                src="https://via.placeholder.com/200"
                alt="Author"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover border border-gray-200 shadow-md mb-3 sm:mb-0"
              />
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 text-center sm:text-left">
                  {blog.blog_data.name}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                    Expert Writer
                  </span>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                    Technology Columnist
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 text-center py-2 sm:py-3 md:py-4 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} by {blog.blog_data.name}
          </p>
        </div>
      </div>
    </div>
  );
}

BlogModal.propTypes = {
  blog: PropTypes.shape({
    blog_data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      blog_image: PropTypes.string,
    }).isRequired,
    likes: PropTypes.number,
    comments: PropTypes.array,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onBlogDelete: PropTypes.func.isRequired,
};