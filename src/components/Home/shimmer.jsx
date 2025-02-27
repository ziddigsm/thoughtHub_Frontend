import { FaComment, FaHeart } from "react-icons/fa";
import PropTypes from "prop-types";
import { useState } from "react";
import { BlogModal } from "../Blog/blogmodal";  

export function Shimmer() {
  return (
    <>
      {[...Array(4)].map((_, index) => {
        return <BlogCard key={index} index={index} isData={false} />;
      })}
    </>
  );
}

export function BlogCard({ index, isData, blog }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (isData) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddComment = (comment) => {
    console.log("New comment:", comment);
  };

  return (
    <>
     <div
  key={index}
  className=" group relative overflow-hidden rounded-2xl bg-white transition-all duration-500 hover:scale-105 shadow-xl cursor-pointer hover:shadow-2xl transform scale-90"
  onClick={handleCardClick}
>
  <div className="aspect-[3/2] overflow-hidden">
    {isData ? (
      <img
        src={`data:image/png;base64,${blog.blog_data.blog_image}`}
        alt={blog.blog_data.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 animate-pulse" />
    )}
  </div>
  
  <div className="p-4 bg-white relative">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-thought-100 to-hub-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    
    {isData ? (
      <>
        <h2 className="text-xl font-semibold mb-3 line-clamp-1">
          {blog.blog_data.title}
        </h2>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {blog.blog_data.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FaHeart className="w-3 h-3 mr-1 text-red-500" />
              {blog.likes}
            </span>
            <span className="flex items-center">
              <FaComment className="w-3 h-3 mr-1 text-blue-500" />
              {blog.comments?.length || 0}
            </span>
          </div>
          <span className="text-sm font-medium text-black group-hover:translate-x-1 transition-transform duration-300">
            Read more →
          </span>
        </div>
      </>
    ) : (
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded animate-pulse w-80" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>
        <div className="flex justify-between items-center">
          <div className="space-x-4 flex">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )}
  </div>
</div>

      {isData && (
        <BlogModal
          blog={blog}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddComment={handleAddComment}
        />
      )}
    </>
  );
}

BlogCard.propTypes = {
  index: PropTypes.number.isRequired,
  isData: PropTypes.bool.isRequired,
  blog: PropTypes.object,
};