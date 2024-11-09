import axios from "axios";
import { BlogCard } from "../Home/shimmer";
import { useEffect, useState } from "react";

export function FetchBlogs() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const getBlogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_GET_USER_DATA_GO_API + parseInt(userData.user_id)}`);
            setBlogs(res.data);
        }
        catch (err) {
            console.log(err);
            alert('Please try again later');
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getBlogs();
        const handleBlogCreated = () => getBlogs();
        window.addEventListener('newBlogSuccess', handleBlogCreated);   
        return () => window.removeEventListener('newBlogSuccess', handleBlogCreated);
    },[]);


    return (
        <div className=" relative grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 p-10 w-full gap-y-12 z-10 sm:justify-items-center drop-shadow-2xl">
            {loading ? (
                        [...Array(9)].map((_, index) => {
                            return (
                                <BlogCard key={index} index={index} isData = {false}/>
                            )
                        })
            ) : (
                blogs.map((blog, index) => {
                    return (
                        <BlogCard key={index} index={index} isData={true} blog={blog} />
                    )
                })
            ) }
    </div>
    )
}

