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
            {/* Heading */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary sm:mb-0">
                    Tags
                </h2>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-center mb-8 sm:text-lg md:text-2xl text-[#1E90FF] font-medium mt-1 sm:mt-0">
                Choose a Tag to search
            </p>

            {/* Tags or Loading Skeleton */}
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
                            className="cursor-pointer px-4 py-2 rounded-full bg-white text-center text-sm font-medium text-gray-700 border border-gray-300 hover:scale-105 transition transform"
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
