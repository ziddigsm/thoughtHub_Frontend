import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { GrClose } from "react-icons/gr";
import PropTypes from "prop-types";
import Compressor from "compressorjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAlertContext } from "../../contexts/alertContext";

export function NewBlogModal({ isOpen, onClose, isEditing = false, blog }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const { showAlert } = useAlertContext();
  const [isPublishing, setIsPublishing] = useState(false);
  const imageInputRef = useRef(null);

  let apiKey = "VITE_API_KEY_" + new Date().getUTCDay();

  useEffect(() => {
    if (isEditing) {
      setTitle(blog.blog_data.title || "");
      setContent(blog.blog_data.content || "");
      setImagePreview(`data:image/png;base64,${blog.blog_data.blog_image}`);
    }
  }, [isEditing, blog]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "color",
    "background",
    "blockquote",
    "code-block",
  ];

  const handleImageChange = (e) => {
    if (e.target.files[0].size > 5 * 1024 * 1024) {
      showAlert("File size should be less than 5MB", "warning");
      resetImageInput();
      return;
    }
    compressImage(e.target.files[0]);
  };

  const resetImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
    setImage(null);
    setImagePreview(null);
  };

  const compressImage = (file) => {
    new Compressor(file, {
      quality: 0.6,
      success: (compressedFile) => {
        setImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      },
      error(err) {
        console.error("Compression error:", err.message);
        resetImageInput();
        showAlert(
          "We ran into a trouble. Please try again later with PNG, JPEG or JPG image format.",
          "error"
        );
      },
    });
    return;
  };

  const countWords = (html) => {
    // Remove HTML tags and count words
    const text = html.replace(/<[^>]*>/g, " ");
    return text.split(/\s+/).filter(Boolean).length;
  };

  const validateFields = () => {
    const newErrors = {};
    if (title.trim(" ").length < 10) {
      newErrors.title = "Title must be at least 10 characters long.";
    }

    const contentText = content.replace(/<[^>]*>/g, "").trim();
    const wordCount = countWords(content);

    if (contentText.length < 300) {
      newErrors.content = "Content must be at least 300 characters long.";
    } else if (wordCount < 100) {
      newErrors.content = "Content must be at least 100 words long.";
    } else if (wordCount > 3000) {
      newErrors.content = "Content must be at most 3000 words long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublishBlog = async () => {
    if (!validateFields()) {
      return;
    }
    setIsPublishing(true);
    try {
      if (!isEditing && image === null) {
        showAlert("Please upload an image", "warning");
        setIsPublishing(false);
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("blog_image", image);
      }
      if (!isEditing) {
        formData.append(
          "user_id",
          JSON.parse(localStorage.getItem("userData")).user_id
        );
      }
      if (isEditing) {
        formData.append("blog_id", blog?.blog_data?.id);
        formData.append("user_id", blog?.blog_data.user_id);
        const updateBlogAPI = import.meta.env.VITE_UPDATE_BLOG_GO_API;
        let res = await axios.put(updateBlogAPI, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": import.meta.env[apiKey],
          },
        });
        if (res.status === 200) {
          showAlert("Blog updated successfully", "success");
          onClose();
          setTimeout(() => {
            window.dispatchEvent(new Event("editBlogSuccess"));
          }, 500);
        } else {
          showAlert("Failed to update blog. Please try again later.", "error");
        }
      } else {
        const createBlogAPI = import.meta.env.VITE_CREATE_BLOG_GO_API;
        let res = await axios.post(createBlogAPI, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": import.meta.env[apiKey],
          },
        });
        if (res.status === 200) {
          onClose();
          setTimeout(() => {
            window.dispatchEvent(new Event("newBlogSuccess"));
          }, 500);
        }
      }
    } catch {
      showAlert("Failed to create blog. Please try again later.", "error");
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 sm:p-6 md:p-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl relative max-h-[90vh] overflow-y-auto animate-popIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <GrClose size={20} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
          Create a New Blog
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Cover Image
          </label>
          <div className="flex items-center justify-center w-full h-40 sm:h-48 md:h-56 border-2 border-dashed rounded-lg border-gray-300 p-4 bg-gray-50 relative hover:bg-gray-100 transition-colors duration-200">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <span className="text-gray-500">Click to upload an image</span>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-thought-100 text-lg"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="border rounded-lg focus-within:ring-2 focus-within:ring-thought-100 pb-10 overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="rounded-b-lg h-64 sm:h-72 md:h-80 lg:h-96  [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:sticky [&_.ql-toolbar]:pb-2 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:bg-thought-50"
              placeholder="Write your content here..."
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePublishBlog}
            disabled={isPublishing}
            className={`bg-thought-100 text-white px-6 py-3 rounded-lg hover:bg-hub-100 transition-all duration-200 flex-grow sm:flex-grow-0 ${
              isPublishing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isEditing ? "Update" : isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

NewBlogModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  blog: PropTypes.shape({
    blog_data: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      blog_image: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};
