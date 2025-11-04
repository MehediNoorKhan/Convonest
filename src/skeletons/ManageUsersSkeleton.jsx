import React from "react";

export default function ManageUsersSkeleton() {
    const rows = Array.from({ length: 5 }); // Show 5 skeleton rows

    return (
        <div className="relative overflow-x-auto sm:rounded-lg max-w-7xl mx-auto mt-6 p-2 sm:p-4 md:p-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-start">
                Manage Users
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Name</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Email</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Role</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Make Admin</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Subscription</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2 sm:space-y-3">
                        {rows.map((_, index) => (
                            <tr
                                key={index}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-lg transform transition-all duration-300 animate-pulse"
                            >
                                <td className="px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3">
                                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
