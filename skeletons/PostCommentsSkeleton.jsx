// src/Skeletons/PostCommentsSkeleton.jsx
export default function PostCommentsSkeleton() {
    return (
        <div className="p-6 md:p-8 animate-pulse space-y-8">
            {/* Post Header */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 space-y-4">
                {/* Title */}
                <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-100 rounded"></div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    </div>
                </div>

                {/* Post Image */}
                <div className="w-full h-64 bg-gray-200 rounded-lg mt-6"></div>

                {/* Post Description */}
                <div className="space-y-2 mt-6">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                </div>

                {/* Tags and Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="flex gap-3 mt-2">
                        <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>

                {/* Individual Comment Skeletons */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b pb-4 last:border-none flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                            <div className="h-3 w-full bg-gray-100 rounded"></div>
                            <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                ))}

                {/* Comment Input */}
                <div className="mt-6 space-y-3">
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-20 w-full bg-gray-100 rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded self-end"></div>
                </div>
            </div>
        </div>
    );
}
