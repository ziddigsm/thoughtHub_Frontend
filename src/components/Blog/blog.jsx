import axios from "axios";
import { BlogCard } from "../Home/shimmer";
import { useEffect, useState } from "react";
import { Pagination } from "../Home/pagination";

export function FetchBlogs() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [blogs, setBlogs] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 9;
    const [offset, setOffset] = useState(0);

    const getBlogData = async () => {
        const response = await axios.get(`${import.meta.env.VITE_GET_BLOG_DATA_GO_API + parseInt(userData.user_id)}&limit=${limit}&offset=${offset}`);
        return response.data;
    }

    const getBlogs = async () => {
        try {
            setLoading(true);
            const blogData = await getBlogData();
            setBlogs(blogData.blogs);
            setPageCount(Math.ceil(blogData.totalCount / limit));
            console.log(pageCount)
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
        page >= pageCount ? setPage(pageCount) : setPage(page + 1);
        setOffset(offset + limit);
        getBlogs();
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
            setOffset(offset - limit);
            getBlogs();
        }
    };

    useEffect(() => {
        getBlogs();
        const handleBlogCreated = () => getBlogs();
        window.addEventListener('newBlogSuccess', handleBlogCreated);
        console.log('In useeffect');
        return () => window.removeEventListener('newBlogSuccess', handleBlogCreated);
    }, [page]);

    return (
        <div className="flex flex-col items-center mb-11 font-sans">
            <div className=" relative grid grid-cols-1  md:grid-cols-2 justify-items-center lg:grid-cols-3 p-10 w-full gap-y-12 z-10 sm:justify-items-center drop-shadow-2xl">
            {loading ? (
                [...Array(9)].map((_, index) => (
                    <BlogCard key={index} index={index} isData={false} />
                ))
            ) : (
                blogs.map((blog, index) => (
                    <BlogCard key={index} index={index} isData={true} blog={blog} />
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
    )
}
