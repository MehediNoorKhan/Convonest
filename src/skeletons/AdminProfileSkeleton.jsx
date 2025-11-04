export default function AdminProfileSkeleton() {
    return (
        <div className="p-6 flex flex-col items-center animate-pulse">
            {/* Profile picture */}
            <div className="h-28 w-28 bg-gray-200 rounded-full mb-6"></div>

            {/* Name and role */}
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-24 bg-gray-200 rounded mb-8"></div>

            {/* Info fields */}
            <div className="w-full max-w-md space-y-4">
                {Array(5)
                    .fill("")
                    .map((_, i) => (
                        <div key={i} className="h-5 bg-gray-200 rounded"></div>
                    ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
                <div className="h-10 w-28 bg-gray-200 rounded"></div>
                <div className="h-10 w-28 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
