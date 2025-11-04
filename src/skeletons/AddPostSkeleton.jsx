import React from "react";

const AddPostSkeleton = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6 animate-pulse space-y-6">
            {/* Heading */}
            <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto"></div>

            {/* Author Name */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Author Email */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Author Image */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Post Title */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Post Description */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-24 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Select */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Submit Button */}
            <div className="h-12 w-full bg-gray-300 rounded"></div>
        </div>
    );
};

export default AddPostSkeleton;
