export default function AdminDashboardSkeleton() {
    return (
        <div className="space-y-8 p-6 max-w-5xl mx-auto">
            {/* Skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-5 rounded-xl shadow-md bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-between"
                    >
                        <div className="space-y-2 w-full">
                            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
                        </div>
                        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Pie chart skeleton */}
            <div className="max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md p-4 animate-pulse" style={{ height: "220px" }}>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto mb-4"></div>
                <div className="h-full w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
        </div>
    );
}
