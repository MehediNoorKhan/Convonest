import { Link } from "react-router";

export default function Forbidden() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Access Forbidden
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
                Sorry, you don’t have permission to access this page.
                Please contact the administrator if you believe this is a mistake.
            </p>
            <Link
                to="/"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
