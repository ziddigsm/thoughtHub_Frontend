import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  FaComment,
  FaClock,
  FaHeart,
  FaFacebook,
  FaLinkedin,
  FaCopy,
  FaRobot,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import axios from "axios";
import { useAlertContext } from "../../contexts/alertContext";
import { useModal } from "../../contexts/warningContext";

import { NewBlogModal } from "./newblog";

export function BlogModal({
  blog,
  isOpen,
  onClose,
  onAddComment,
  onBlogDelete,
}) {
  const modalRef = useRef(null);
  const { showWarning } = useModal();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  let apiKey = "VITE_API_KEY_" + new Date().getDay();

  useEffect(() => {
    if (isOpen && blog?.blog_data?.id) {
      navigate(`/home?blog_id=${blog.blog_data.id}`, { replace: true });
    } else if (!isOpen) {
      navigate("/home", { replace: true });
    }
  }, [isOpen, blog?.blog_data?.id, navigate]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

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
      const deleteResponse = await axios.delete(deleteBlogAPI, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": import.meta.env[apiKey],
        },
      });

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

  const handleClose = () => {
    navigate("/home", { replace: true });
    onClose();
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

  const handleEditBlog = () => {
    setIsEditModalOpen(true);
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      <div
        className="fixed inset-0 cursor-pointer bg-gradient-to-b from-transparent via-gray-900/60 to-transparent backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      {isEditModalOpen && (
        <NewBlogModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEditing={true}
          blog={blog}
        />
      )}
      <div
        ref={modalRef}
        className="relative w-full mx-4 bg-white/95 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{
          maxWidth: "calc(min(90vw, 68rem))",
          maxHeight: "calc(min(90vh, 85vh))",
          transform: "translateY(0)",
        }}
      >
        {/* Header */}
        <div className="bg-white/90 border-b border-gray-200 p-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                {blog.blog_data.title}
              </h1>
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-gray-600">
                {" "}
                <div className="flex items-center space-x-3">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="font-normal text-xs md:font-medium">
                      {blog.blog_data.name}
                    </span>
                    {/*Commented the below code temporarily as verification is not implemented yet.*/}
                    {/* <div className="text-xs flex items-center text-gray-500">
                      <FaCheckCircle className="text-green-500 mr-1" />
                      Verified Author
                    </div> */}
                  </div>
                </div>
                <span className="opacity-30">•</span>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-gray-400" />
                  <span>{readTime} min read</span>
                </div>
                {userId === blog.blog_data.user_id && (
                  <>
                    <span className="opacity-30">•</span>
                    <MdOutlineModeEdit
                      className={`text-hub-100 size-8 sm:size-7 cursor-pointer hover:text-thought-100 `}
                      onClick={handleEditBlog}
                      title="Edit blog"
                    />
                  </>
                )}
                <span className="opacity-30">•</span>
                <MdDelete
                  className="text-hub-100 hover:text-thought-100 cursor-pointer size-8 sm:size-7"
                  onClick={handleDeleteBlog}
                />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-900 transition-colors rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <div key={tab} className="group relative flex-1">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full py-4 text-center uppercase tracking-wide text-sm font-semibold transition-colors ${
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
                <div className="absolute hidden group-hover:block z-50 bg-thought-75 text-hub-100 text-sm p-2 rounded mt-2 top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  Coming soon
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white overflow-y-auto max-h-[calc(100vh-300px)]">
          {activeTab === "content" && (
            <div>
              <div className="relative mb-8 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={
                    blog.blog_data.blog_image
                      ? `data:image/png;base64,${blog.blog_data.blog_image}`
                      : "https://via.placeholder.com/800x400"
                  }
                  alt={blog.blog_data.title}
                  className="w-full h-[450px] object-cover"
                />
              </div>

              <article className="prose max-w-none text-gray-800">
                <div
                  dangerouslySetInnerHTML={{
                    __html: blog.blog_data.content,
                  }}
                />
              </article>

              <div className="mt-8 flex justify-between items-center">
                <div className="flex space-x-6 text-gray-600">
                  <button
                    href="#"
                    className="hover:text-blue-600 transition-all duration-200"
                  >
                    <FaFacebook
                      size={28}
                      onClick={() => handleSharing(socialUrls.facebook)}
                    />
                  </button>
                  <button
                    href="#"
                    className="hover:text-black transition-all duration-200"
                  >
                    <FaXTwitter
                      size={28}
                      onClick={() => handleSharing(socialUrls.twitter)}
                    />
                  </button>
                  <button
                    href="#"
                    className="hover:text-blue-700 transition-all duration-200"
                  >
                    <FaLinkedin
                      size={28}
                      onClick={() => handleSharing(socialUrls.linkedin)}
                    />
                  </button>
                  <button className="hover:text-thought-100 transition-all duration-200">
                    <FaCopy
                      size={24}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showAlert("Link copied to clipboard!", "info");
                      }}
                    />
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaHeart size={20} className="text-red-500" />
                    <span>{blog.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaComment size={20} className="text-blue-400" />
                    <span>{blog.comments?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* QuickScribe Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleQuickScribe}
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-thought-100 to-hub-100 text-white py-3 px-6 rounded-full flex items-center justify-center mx-auto space-x-2 hover:from-thought-100/90 hover:to-hub-100/90 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaRobot size={20} />
                  <span>
                    {isLoading ? "Generating Summary..." : "QuickScribe"}
                  </span>
                </button>
                {error && <p className="mt-2 text-red-500">{error}</p>}
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Article Summary</h2>
              <div className="bg-gray-50 p-6 rounded-lg prose max-w-none">
                {summary}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              {blog.comments && blog.comments.length > 0 ? (
                <div className="space-y-4">
                  {blog.comments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src="https://via.placeholder.com/40"
                          alt="Commenter"
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            {comment.name}
                          </span>
                          <div className="text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}

              <div className="mt-6">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  rows="4"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Share your thoughts..."
                ></textarea>
                <button
                  onClick={handleCommentSubmit}
                  className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="flex items-center space-x-8 bg-gray-50 p-6 rounded-2xl">
              <img
                src="https://via.placeholder.com/200"
                alt="Author"
                className="w-48 h-48 rounded-full object-cover border border-gray-200 shadow-md"
              />
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  {blog.blog_data.name}
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Expert Writer
                  </span>
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Technology Columnist
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 text-center py-4 border-t border-gray-300">
          <p className="text-sm text-gray-600">
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
      user_id: PropTypes.string.isRequired,
    }).isRequired,
    likes: PropTypes.number,
    comments: PropTypes.array,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onBlogDelete: PropTypes.func.isRequired,
};
