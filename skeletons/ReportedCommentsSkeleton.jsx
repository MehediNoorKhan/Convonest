import React from "react";

export default function ReportedCommentsSkeleton({ rows = 5 }) {
    return (
        <div className="max-w-7xl mx-auto mt-6 p-4">
            {/* header skeleton */}
            <div className="mb-4">
                <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>

            {/* table skeleton container */}
            <div className="relative overflow-x-auto sm:rounded-lg">
                <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm">
                    {/* toolbar / search skeleton */}
                    <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-4">
                        <div className="h-8 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>

                    {/* table header skeleton */}
                    <div className="px-6 py-3 border-t border-b border-gray-100 dark:border-gray-800">
                        <div className="flex gap-6">
                            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>
                    </div>

                    {/* rows */}
                    <div className="space-y-4 p-4">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    {/* left: comment + commenter */}
                                    <div className="flex-1">
                                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
                                        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    </div>

                                    {/* reporter badge skeleton */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* pagination skeleton */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
