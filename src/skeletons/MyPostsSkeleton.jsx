// src/Skeletons/MyPostsSkeleton.jsx
export default function MyPostsSkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Page Title */}
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="h-10 w-full sm:w-1/2 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-sm p-4 flex flex-col"
                    >
                        {/* Image */}
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>

                        {/* Title */}
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>

                        {/* Description */}
                        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-3 w-5/6 bg-gray-100 rounded mb-3"></div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center mt-auto pt-2">
                            <div className="h-8 w-20 bg-gray-200 rounded"></div>
                            <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
