import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import AdminDashboardSkeleton from "../Skeletons/AdminDashboardSkeleton";
import FailedToLoad from "../Components/FailedToLoad";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReportedCommentsSkeleton from "../skeletons/ReportedCommentsSkeleton";

const MySwal = withReactContent(Swal);

export default function ReportedComments() {
    const axiosSecure = useAxiosSecure();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async (page = 1, limit = 10, status = "pending") => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosSecure.get("/reportsforadmin", {
                params: { page, limit, status },
            });

            if (res.data.success) {
                const dataWithSafeComments = await Promise.all(
                    res.data.data.map(async (report) => {
                        if (!report.comment || !report.commenterName) {
                            try {
                                const commentRes = await axiosSecure.get(`/comments/${report.commentId}`);
                                if (commentRes.data.success && commentRes.data.data) {
                                    return {
                                        ...report,
                                        comment: commentRes.data.data.comment || "N/A",
                                        commenterName: commentRes.data.data.commenterName || "Unknown",
                                    };
                                }
                            } catch {
                                return { ...report, comment: "Deleted", commenterName: "Unknown" };
                            }
                        }
                        return report;
                    })
                );
                setReports(dataWithSafeComments);

                // 🔹 Toast on successful fetch
            } else {
                setError("Failed to fetch reports");
            }
        } catch (err) {
            setError("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (report) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "This will delete the comment and the report!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            if (report.commentId) await axiosSecure.delete(`/comments/${report.commentId}`);
            await axiosSecure.delete(`/reports/${report._id}`);
            setReports((prev) => prev.filter((r) => r._id !== report._id));

            // 🔹 Toast on delete success
            MySwal.fire({
                icon: "success",
                title: "Deleted successfully!",
                toast: true,
                position: "top-right",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch {
            MySwal.fire({
                icon: "error",
                title: "Failed to delete comment/report",
                toast: true,
                position: "top-right",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    if (loading) return <ReportedCommentsSkeleton />;

    if (error) return <FailedToLoad message={error} />;
    if (!reports.length)
        return <p className="text-center mt-6 text-gray-500">No reported comments found.</p>;

    return (
        <div className="relative overflow-x-auto sm:rounded-lg max-w-7xl mx-auto mt-6 p-2 sm:p-4 md:p-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-start">
                Reported Comments
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Comment</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Commenter</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Reported By</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Status</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2 sm:space-y-3">
                        {reports.map((report, index) => (
                            <tr
                                key={report._id}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-lg transform transition-all duration-300 hover:bg-[#E0FFFF] hover:shadow-xl opacity-0 animate-fadeIn"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                            >
                                <td className="px-4 py-2 sm:px-6 sm:py-3">{report.comment || "Deleted"}</td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3">{report.commenterName || "Unknown"}</td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3">
                                    <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-800 font-medium text-xs sm:text-sm">
                                        {report.reporterEmail || "Unknown"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3">
                                    <div className="inline-flex items-center gap-2">
                                        {report.status === "pending" && (
                                            <div className="status status-warning animate-ping"></div>
                                        )}
                                        {report.status === "resolved" && (
                                            <div className="status status-success animate-bounce"></div>
                                        )}
                                        <span className="capitalize text-xs sm:text-sm">{report.status}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-3">
                                    <button
                                        onClick={() => handleDelete(report)}
                                        className="btn btn-error inline-flex items-center gap-2 text-white text-xs sm:text-sm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

        .status {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
        }
        .status-success { background-color: #34d399; }
        .status-warning { background-color: #facc15; }
        .status-error { background-color: #f87171; }
      `}</style>
        </div>
    );
}
