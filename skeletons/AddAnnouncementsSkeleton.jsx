import React from "react";

export default function AddAnnouncementSkeleton() {
    return (
        <div className="max-w-4xl mx-auto mt-8 mb-8 p-8 rounded-xl shadow-2xl bg-white animate-pulse">
            {/* Title */}
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>

            {/* Form Skeleton */}
            <div className="space-y-6">
                {/* Author Name */}
                <div>
                    <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>

                {/* Author Image */}
                <div>
                    <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>

                {/* Announcement Title */}
                <div>
                    <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>

                {/* Description */}
                <div>
                    <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
}
