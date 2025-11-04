import { Link } from "react-router";

export default function MembershipSuccess() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-md w-full">
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                    🎉 Payment Successful!
                </h2>
                <p className="text-gray-700 mb-6">
                    Congratulations! You are now a Gold Member. Enjoy all the exclusive benefits.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
