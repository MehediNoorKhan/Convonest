// src/Skeletons/MembershipSkeleton.jsx
export default function MembershipSkeleton() {
    return (
        <div className="py-24 flex justify-center items-center px-6 animate-pulse">
            <div className="max-w-xl w-full bg-white rounded-2xl p-8 text-center shadow-sm space-y-5">
                {/* Title */}
                <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto"></div>

                {/* Subtitle */}
                <div className="h-4 w-4/5 bg-gray-200 rounded mx-auto"></div>
                <div className="h-4 w-3/5 bg-gray-100 rounded mx-auto"></div>

                {/* Input fields */}
                <div className="space-y-3 mt-8">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>

                {/* Payment button */}
                <div className="h-11 w-1/2 bg-gray-300 rounded mx-auto mt-6"></div>
            </div>
        </div>
    );
}
