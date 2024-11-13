import axios from "axios";
import { BlogCard } from "../Home/shimmer";
import { useEffect, useState } from "react";
import { Pagination } from "../Home/pagination";
import PropTypes from 'prop-types';

export function FetchBlogs({isMyBlogs}) {
    const [blogs, setBlogs] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 9;

    const getBlogData = async (pageNumber) => {
        const offset = (pageNumber - 1) * limit;
        let userId = isMyBlogs ? JSON.parse(localStorage.getItem('userData'))?.user_id : 0;
        const response = await axios.get(
            `${import.meta.env.VITE_GET_BLOG_DATA_GO_API + parseInt(userId)}&limit=${limit}&offset=${offset}`
        );
        return response.data;
    }

    const getBlogs = async (pageNumber) => {
        try {
            setLoading(true);
            const blogData = await getBlogData(pageNumber);
            setBlogs(blogData.blogs);
            setPageCount(Math.ceil(blogData.totalCount / limit));
        }
        catch (err) {
            console.log(err);
            alert('Please try again later');
        }
        finally {
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        if (page < pageCount) {
            const nextPage = page + 1;
            setPage(nextPage);
            getBlogs(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
            getBlogs(prevPage);
        }
    };

    useEffect(() => {
        getBlogs(page);
        
        const handleBlogCreated = () => getBlogs(page);
        window.addEventListener('newBlogSuccess', handleBlogCreated);
        
        return () => window.removeEventListener('newBlogSuccess', handleBlogCreated);
    }, [isMyBlogs]); // Only depend on isMyBlogs change

    return (
        <div className="flex flex-col items-center pb-6">
            <div className="relative grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 p-10 w-full gap-y-12 z-10 sm:justify-items-center drop-shadow-2xl">
                {loading ? (
                    [...Array(9)].map((_, index) => (
                        <BlogCard key={index} index={index} isData={false} />
                    ))
                ) : (
                    blogs.map((blog, index) => (
                        <BlogCard key={blog.id || index} index={index} isData={true} blog={blog} />
                    ))
                )}
            </div>
            <Pagination
                totalPages={pageCount}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                page={page}
            />
        </div>
    );
}

FetchBlogs.propTypes = {
    isMyBlogs: PropTypes.bool.isRequired,
};