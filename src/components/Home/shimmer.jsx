import { FaComment, FaHeart } from "react-icons/fa";

export function Shimmer() {
    return (
        <>
            {[...Array(4)].map((_, index) => {
                return (
                    <BlogCard key={index} index={index} isData={false} />
                )
            })}
        </>
    );
}

export function BlogCard({ index, isData, blog }) {
    return (
        <div key={index} className="flex flex-col bg-thought-75 h-auto w-full p-2 hover:scale-105 transition-transform ease-in-out rounded-2xl md:w-72 xl:w-96">
            <div className={`bg-thought-75 h-44 w-full rounded-xl overflow-hidden ${isData ? '' : 'animate-pulse'}`}>
                {isData ? (
                    <img
                        className="rounded-xl h-44 w-full object-cover"
                        src={`data:image/png;base64,${blog.blog_data.blog_image}`}
                        alt={`${blog.blog_data.title}`}
                    />
                ) : ''}
            </div>

            <div className={`${isData ? 'font-bold text-base overflow-hidden text-ellipsis whitespace-nowrap mt-2 max-w-full' : 'bg-gray-200 h-4 w-3/4 mt-4 mb-2 animate-pulse'}`}>
                {isData ? blog.blog_data.title : ''}
            </div>

            <div className={`mt-1 ${isData ? 'text-wrap overflow-hidden text-ellipsis whitespace-normal line-clamp-3 text-sm xl:line-clamp-6 max-w-full' : 'bg-gray-200 h-3 w-full mt-2 animate-pulse'}`}>
                {isData ? blog.blog_data.content : ''}
            </div>
            <div className={` ${isData ? '' : 'bg-gray-200 h-3 w-full mt-2 max-sm:hidden animate-pulse'}`}></div>
            <div className={` ${isData ? '' : 'bg-gray-200 h-3 w-5/6 mt-2 max-sm:hidden animate-pulse'}`}></div>
            <div className={`flex flex-grow justify-between items-center mt-4 ${isData ? '' : 'animate-pulse'}`}>
                <div className={`font-semibold italic ${isData ? '' : 'h-4 bg-gray-200 w-5/6'}`}>
                    {isData ? blog.blog_data.name : ''}
                </div>
                <div className="flex flex-row space-x-4 items-center">
                    <div className="flex flex-row items-center space-x-2">
                        <FaHeart size={20} className="text-red-500" /><span>{isData ? blog.likes : ''}</span>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <FaComment size={20} className="text-blue-300" /><span>{isData ? (blog.comments?.length || 0) : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
