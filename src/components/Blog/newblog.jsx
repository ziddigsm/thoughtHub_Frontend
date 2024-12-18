import axios from "axios";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import PropTypes from "prop-types";
import Compressor from "compressorjs";
import { Alert } from "../Settings/alert";


export function NewBlogModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleImageChange = (e) => {
    if(e.target.files[0].size > 5 * 1000 * 1024) {
        alert("File size should be less than 5MB");
       e.target.value = null;
        setImage(null);
        setImagePreview(null);
        return;
    }
    compressImage(e.target.files[0]);
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
          alert("We ran into a trouble. Please try again later.");
        },
      });
    return
  }
  const validateFields = () => {
    const newErrors = {};
    if (title.trim(' ').length < 10) {
      newErrors.title = "Title must be at least 10 characters long.";
    }
    if (content.trim(' ').length < 100 ) {
      newErrors.content = "Content must be at least 100 characters long.";
    }
    else if (content.split(' ').length < 10) {
        newErrors.content = "Content must be at least 10 words long.";
    }
    else if (content.split(' ').length > 1000) {
        newErrors.content = "Content must be at most 1000 words long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublishBlog = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      if (image === null) {
        throw new Error("Please upload an image");
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("blog_image", image);
      formData.append(
        "user_id",
        JSON.parse(localStorage.getItem("userData")).user_id
      );
      let res = await axios.post(
        "http://localhost:8080/api/v1/create_blog",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        onClose();
        setTimeout(() => {
          window.dispatchEvent(new Event("newBlogSuccess"));
        }, 500);
      }
    } catch (err) {
      console.log(err);
      setAlertMessage("Please try uploading another image.");
      setAlertType("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 sm:p-6 md:p-8">
            {alertMessage && (
            <Alert
              type={alertType}
              message={alertMessage}
              onClose={() => setAlertMessage("")}
              className="z-50"
            />
          )}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl relative max-h-[80vh] overflow-y-auto animate-popIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <GrClose size={20} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
          Create a New Blog
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="flex items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-lg border-gray-300 p-4 bg-gray-50 relative">
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
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-thought-100"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            className="w-full p-2 h-24 sm:h-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-thought-100"
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
           {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <button
          onClick={handlePublishBlog}
          className="w-full bg-thought-100 text-white p-2 rounded-lg hover:bg-hub-100 transition-all duration-200"
        >
          Publish
        </button>
      </div>
    </div>
  );
}

NewBlogModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};