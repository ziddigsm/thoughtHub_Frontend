import axios from "axios";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import PropTypes from "prop-types";

export function NewBlogModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handlePublishBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("blog_image", image);
      formData.append(
        "user_id",
        JSON.parse(sessionStorage.getItem("userData")).user_id
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
      console.log(res);
      if (res.status === 200) {
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 sm:p-6 md:p-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl relative max-h-[80vh] overflow-y-auto">
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
                src={image}
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
          ></textarea>
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