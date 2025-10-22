export default function ManagePostsSkeleton() {
    return (
        <div className="p-6 animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-40 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Posts list */}
            <div className="space-y-5">
                {Array(5)
                    .fill("")
                    .map((_, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
                        >
                            <div className="h-24 w-full md:w-32 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-20 bg-gray-200 rounded self-start md:self-auto"></div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
