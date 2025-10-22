import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function ErrorPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-2xl"
            >
                <h1 className="text-9xl font-extrabold mb-4 drop-shadow-lg">404</h1>
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="mb-6 text-lg text-white/90">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow-lg hover:bg-yellow-500 transition"
                >
                    ⬅ Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
