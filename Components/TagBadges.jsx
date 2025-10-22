// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import LoadingSpinner from "./LoadingSpinner";
// import FailedToLoad from "./FailedToLoad";

// const TagBadges = ({ onTagClick }) => {
//     // Explicit mapping for background and text colors
//     const colors = [
//         { bg: "bg-red-100", text: "text-red-700" },
//         { bg: "bg-green-100", text: "text-green-700" },
//         { bg: "bg-blue-100", text: "text-blue-700" },
//         { bg: "bg-yellow-100", text: "text-yellow-700" },
//         { bg: "bg-purple-100", text: "text-purple-700" },
//         { bg: "bg-pink-100", text: "text-pink-700" },
//         { bg: "bg-indigo-100", text: "text-indigo-700" },
//         { bg: "bg-teal-100", text: "text-teal-700" },
//     ];

//     const { data: tags = [], isLoading, isError } = useQuery({
//         queryKey: ["tags"],
//         queryFn: async () => {
//             const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
//             return res.data || [];
//         },
//         staleTime: 1000 * 60 * 5,
//     });

//     if (isError) return <FailedToLoad />;

//     return (
//         <div className="max-w-7xl mx-auto my-6">
//             {/* Heading and Subtitle */}
//             <div className="flex justify-between items-center">
//                 <h2 className="text-3xl font-bold text-left text-primary pl-8">Tags</h2>
//             </div>
//             <p className="text-center text-lg text-[#1F51FF] font-medium flex-1 mt-4 mb-8">Choose a Tag to search</p>
//             {/* Tags or Skeleton */}
//             {isLoading ? (
//                 <div className="flex gap-4 flex-wrap justify-start items-center ml-7">
//                     {Array.from({ length: 6 }).map((_, idx) => (
//                         <div
//                             key={idx}
//                             className="h-8 w-20 rounded-full bg-gray-200 animate-pulse"
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="flex flex-row gap-4 flex-wrap justify-start items-center ml-7">
//                     {tags.map((tag, idx) => {
//                         const color = colors[idx % colors.length];
//                         return (
//                             <span
//                                 key={tag._id || idx}
//                                 onClick={() => onTagClick(tag.name)}
//                                 className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${color.bg} ${color.text} hover:scale-105 transition transform`}
//                             >
//                                 {tag.name}
//                             </span>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TagBadges;


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import LoadingSpinner from "./LoadingSpinner";
// import FailedToLoad from "./FailedToLoad";

// const TagBadges = ({ onTagClick }) => {
//     // Explicit mapping for text colors only; bg will now be white
//     const colors = [
//         { text: "text-red-700" },
//         { text: "text-green-700" },
//         { text: "text-blue-700" },
//         { text: "text-yellow-700" },
//         { text: "text-purple-700" },
//         { text: "text-pink-700" },
//         { text: "text-indigo-700" },
//         { text: "text-teal-700" },
//     ];

//     const { data: tags = [], isLoading, isError } = useQuery({
//         queryKey: ["tags"],
//         queryFn: async () => {
//             const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
//             return res.data || [];
//         },
//         staleTime: 1000 * 60 * 5,
//     });

//     if (isError) return <FailedToLoad />;

//     return (
//         <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 md:px-8">
//             {/* Heading and Subtitle */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-0">
//                     Tags
//                 </h2>
//                 <p className="text-sm sm:text-lg text-[#1F51FF] font-medium mt-1 sm:mt-0">
//                     Choose a Tag to search
//                 </p>
//             </div>

//             {/* Tags or Skeleton */}
//             {isLoading ? (
//                 <div className="flex gap-3 flex-wrap justify-start">
//                     {Array.from({ length: 6 }).map((_, idx) => (
//                         <div
//                             key={idx}
//                             className="h-8 w-20 rounded-full bg-gray-200 animate-pulse"
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="flex flex-wrap gap-3 justify-start">
//                     {tags.map((tag, idx) => {
//                         const color = colors[idx % colors.length];
//                         return (
//                             <span
//                                 key={tag._id || idx}
//                                 onClick={() => onTagClick(tag.name)}
//                                 className={`cursor-pointer px-4 py-2 rounded-full bg-white text-center text-sm font-medium ${color.text} hover:scale-105 transition transform`}
//                             >
//                                 {tag.name}
//                             </span>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TagBadges;


import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import FailedToLoad from "./FailedToLoad";

const TagBadges = ({ onTagClick }) => {
    const { data: tags = [], isLoading, isError } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
            return res.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });

    if (isError) return <FailedToLoad />;

    return (
        <div className="max-w-7xl mx-auto my-6 px-2 sm:px-6 md:px-5">
            {/* Heading and Subtitle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary sm:mb-0">
                    Tags
                </h2>
            </div>

            <p className="text-sm text-center mb-8 sm:text-lg md:text-2xl text-[#1E90FF] font-medium mt-1 sm:mt-0">
                Choose a Tag to search
            </p>

            {/* Tags or Skeleton */}
            {isLoading ? (
                <div className="flex gap-3 flex-wrap justify-start">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-8 w-20 rounded-full bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-3 justify-start">
                    {tags.map((tag, idx) => (
                        <span
                            key={tag._id || idx}
                            onClick={() => onTagClick(tag.name)}
                            className="cursor-pointer px-4 py-2 rounded-full bg-white text-center text-sm font-medium text-gray-500 hover:scale-105 transition transform"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagBadges;
