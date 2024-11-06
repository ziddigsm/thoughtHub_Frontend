import { FaComment, FaHeart } from "react-icons/fa";

export function Shimmer() {

    return (
        <div className=" relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-10 w-full gap-y-12 z-10 justify-items-center drop-shadow-2xl">
            {[...Array(9)].map((_, index) => {
                return (
                    <div key={index} className="bg-hub-50 h-72 w-72 p-2 rounded-2xl  2xl:w-96 max-sm:h-48 max-sm:w-full">
                        <div className="bg-thought-75 h-44 w-full rounded-xl max-sm:h-24 animate-pulse"></div>
                        <div className="bg-gray-200 h-3 w-3/4 mt-4 animate-pulse"></div>
                        <div className="bg-gray-200 h-2 w-full mt-2 animate-pulse"></div>
                        <div className="bg-gray-200 h-2 w-5/6 mt-2 max-sm:hidden animate-pulse"></div>
                        <div className="flex flex-row justify-around content-evenly space-x-2 pt-3 max-sm:pt-3 animate-pulse">
                            <FaHeart size={20} className="text-gray-200" />
                            <FaComment size={20} className="text-gray-200" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}