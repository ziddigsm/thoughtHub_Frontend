import axios from "axios";
import { BlogCard } from "../Home/shimmer";
import { useEffect, useState } from "react";
import { Pagination } from "../Home/pagination";
import { BlogModal } from "./blogmodal";
import PropTypes from 'prop-types';

export function FetchBlogs({ isMyBlogs, searchQuery, isSearching }) {
    const [blogs, setBlogs] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const limit = 9;
    
    const getBlogData = async (pageNumber, query = "") => {
        const offset = (pageNumber - 1) * limit;
        
        try {
            let response;
            if (query) {
                // Use search API when there's a query
                response = await axios.get(
                  `http://localhost:8080/api/v1/search_blogs?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
                  );
            } else {
                // Use original API for regular blog fetching
                const userId = isMyBlogs ? JSON.parse(localStorage.getItem('userData'))?.user_id : 0;
                response = await axios.get(
                    `${import.meta.env.VITE_GET_BLOG_DATA_GO_API + parseInt(userId)}&limit=${limit}&offset=${offset}`
                );
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error;
        }
    };

    const getBlogs = async (pageNumber, query = "") => {
        try {
            setLoading(true);
            const blogData = await getBlogData(pageNumber, query);
            setBlogs(blogData.blogs || []); // Handle potential different response structure
            setPageCount(Math.ceil((blogData.totalCount || blogData.total || 0) / limit));
        } catch (err) {
            console.log(err);
            alert('Please try again later');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isSearching) {
            setPage(1);
            getBlogs(1, searchQuery);
        }
    }, [searchQuery, isSearching]);

    useEffect(() => {
        getBlogs(page, searchQuery);

        const handleBlogCreated = () => getBlogs(page, searchQuery);
        window.addEventListener("newBlogSuccess", handleBlogCreated);

        return () => window.removeEventListener("newBlogSuccess", handleBlogCreated);
    }, [isMyBlogs]);

    const handleNextPage = () => {
        if (page < pageCount) {
            const nextPage = page + 1;
            setPage(nextPage);
            getBlogs(nextPage, searchQuery);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
            getBlogs(prevPage, searchQuery);
        }
    };

    const openBlogModal = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const closeBlogModal = () => {
        setSelectedBlog(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center pb-6">
            <div className="relative grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 p-10 w-full gap-y-12 gap-x-12 z-10 sm:justify-items-center drop-shadow-2xl">
                {loading ? (
                    [...Array(9)].map((_, index) => (
                        <BlogCard key={index} index={index} isData={false} />
                    ))
                ) : blogs.length > 0 ? (
                    blogs.map((blog, index) => (
                        <BlogCard
                            key={blog.id || index}
                            index={index}
                            isData={true}
                            blog={blog}
                            onClick={() => openBlogModal(blog)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No blogs found {searchQuery && `for "${searchQuery}"`}
                    </div>
                )}
            </div>
            {blogs.length > 0 && (
                <Pagination
                    totalPages={pageCount}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    page={page}
                />
            )}
            {isModalOpen && selectedBlog && (
                <BlogModal
                    blog={selectedBlog}
                    isOpen={isModalOpen}
                    onClose={closeBlogModal}
                    onAddComment={(comment) => {
                        console.log(`Comment added: ${comment}`);
                    }}
                />
            )}
        </div>
    );
}

FetchBlogs.propTypes = {
    isMyBlogs: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string,
    isSearching: PropTypes.bool,
};