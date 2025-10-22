import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const FailedToLoad = ({ message = "Failed to load data.", retryFn }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 bg-red-50 rounded-lg shadow-md">
            <FaExclamationTriangle className="text-red-600 text-5xl mb-4" />
            <p className="text-red-700 text-lg font-semibold mb-4 text-center">{message}</p>
            {retryFn && (
                <button
                    onClick={retryFn}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default FailedToLoad;
