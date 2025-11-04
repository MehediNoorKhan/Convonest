export default function MyPostsSkeleton() {
    return (
        <div className="p-6 space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
    );
}
