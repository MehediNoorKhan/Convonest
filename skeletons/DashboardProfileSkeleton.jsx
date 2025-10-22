export default function DashboardProfileSkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse max-w-5xl mx-auto">
            {/* User Info Skeleton */}
            <div className="text-center bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="w-28 h-28 mx-auto rounded-full bg-gray-200"></div>
                <div className="h-6 w-1/3 bg-gray-200 mx-auto rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 mx-auto rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 mx-auto rounded"></div>
            </div>

            {/* About Me Skeleton */}
            <div className="bg-base-200 p-5 rounded-lg shadow-md space-y-3">
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>

            {/* Recent Posts Skeleton */}
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="bg-base-200 p-5 rounded-lg shadow-md space-y-3"
                    >
                        <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                        <div className="flex justify-between mt-2 space-x-2">
                            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
