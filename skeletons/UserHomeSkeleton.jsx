// src/Skeletons/UserHomeSkeleton.jsx
export default function UserHomeSkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
                    >
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Recent Posts Section */}
            <div className="space-y-4">
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4"
                    >
                        <div className="w-full sm:w-1/4 h-24 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
