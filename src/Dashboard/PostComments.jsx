import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FailedToLoad from "../Components/FailedToLoad";
import PostCommentsSkeleton from "../skeletons/PostCommentsSkeleton";

export default function PostComments() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportedComments, setReportedComments] = useState(new Set());
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    const [totalComments, setTotalComments] = useState(0);
    const totalPages = Math.ceil(totalComments / limit);

    const feedbackOptions = [
        { value: "", label: "Select feedback" },
        { value: "inappropriate", label: "Inappropriate content" },
        { value: "spam", label: "Spam or repetitive content" },
        { value: "harassment", label: "Harassment or bullying" },
    ];

    const fetchComments = async (pageNumber = 1) => {
        if (!id || !axiosSecure) return;
        try {
            setLoading(true);
            setError(null);

            // Fetch comments first
            const commentsRes = await axiosSecure.get(`/posts/${id}/comments`, {
                params: { page: pageNumber, limit },
            });

            setComments(commentsRes.data.comments || []);
            setTotalComments(commentsRes.data.totalComments || 0);

            // Fetch post separately to get the title
            const postRes = await axiosSecure.get(`/posts/${id}`);
            setPost(postRes.data || { postTitle: "Post Title" });

            // Set reported status for each comment (if user exists)
            if (user && commentsRes.data.comments) {
                const reportStatuses = await Promise.all(
                    commentsRes.data.comments.map(async (comment) => {
                        try {
                            const statusRes = await axiosSecure.get(
                                `/comments/${comment._id}/report-status`
                            );
                            return {
                                commentId: comment._id,
                                hasReported: statusRes.data.hasReported,
                            };
                        } catch (err) {
                            return { commentId: comment._id, hasReported: false };
                        }
                    })
                );

                const reportedSet = new Set();
                reportStatuses.forEach((status) => {
                    if (status.hasReported) reportedSet.add(status.commentId);
                });
                setReportedComments(reportedSet);
            }
        } catch (err) {
            console.error("Error fetching comments or post:", err);
            setError("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(currentPage);
    }, [currentPage]);

    const handleFeedbackChange = (commentId, feedback) => {
        setSelectedFeedback((prev) => ({ ...prev, [commentId]: feedback }));
    };

    const handleReport = async (commentId) => {
        const feedback = selectedFeedback[commentId];
        if (!feedback) {
            toast.warn("Please select a feedback option before reporting.");
            return;
        }

        try {
            const response = await axiosSecure.post(`/comments/${commentId}/report`, {
                feedback,
                postId: id,
            });

            if (response.data.success) {
                setReportedComments((prev) => new Set([...prev, commentId]));
                setSelectedFeedback((prev) => {
                    const updated = { ...prev };
                    delete updated[commentId];
                    return updated;
                });

                toast.success("Comment reported successfully!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to report comment. Please try again.");
        }
    };

    if (loading) return <PostCommentsSkeleton />;
    if (error) return <FailedToLoad />;

    if (!comments.length)
        return (
            <div className="max-w-7xl mx-auto h-[70vh] flex flex-col justify-center items-center py-8 dark:bg-gray-800 rounded text-center">
                <p className="text-red-500 text-4xl dark:text-gray-300 mb-4">No comments yet</p>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 rounded bg-white">
            <h2 className="text-2xl font-bold mb-6 text-primary">{post?.postTitle || "Post Title"}</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="w-full text-sm text-left rounded-lg bg-white">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Commenter</th>
                            <th className="px-6 py-3">Comment</th>
                            <th className="px-6 py-3 text-center">Feedback</th>
                            <th className="px-6 py-3 text-center">Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((c, index) => {
                            const isReported = reportedComments.has(c._id);
                            const selectedFeedbackForComment = selectedFeedback[c._id] || "";

                            return (
                                <tr
                                    key={c._id || index}
                                    className="bg-white border-b border-gray-200 hover:bg-[#E0FFFF] transition"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.commenterEmail}</td>
                                    <td className="px-6 py-4 text-gray-800">{c.comment}</td>
                                    <td className="px-6 py-4 text-center">
                                        <select
                                            value={selectedFeedbackForComment}
                                            onChange={(e) => handleFeedbackChange(c._id, e.target.value)}
                                            disabled={isReported || !user}
                                            className="select select-primary w-full bg-white text-gray-800 border-gray-300"
                                        >
                                            <option value="" disabled>
                                                Select feedback
                                            </option>
                                            {feedbackOptions.filter(opt => opt.value).map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className={`
      btn 
      ${isReported ? "btn-success" : "btn-error"} 
      relative
      ${isReported || !user || !selectedFeedback[c._id]
                                                    ? "dark:!bg-gray-300 dark:!text-white !opacity-100 cursor-not-allowed group"
                                                    : ""
                                                }
    `}
                                            disabled={isReported || !user || !selectedFeedback[c._id]}
                                        >
                                            {isReported ? "Reported" : "Report"}

                                            {/* Red dot on hover if condition not fulfilled */}
                                            {(isReported || !user || !selectedFeedback[c._id]) && (
                                                <span className="absolute top-1/2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none -translate-y-1/2"></span>
                                            )}
                                        </button>
                                    </td>




                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-2 bg-white">
                <button
                    className="btn btn-sm btn-outline border-gray-300 text-gray-700"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline border-gray-300 text-gray-700"}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="btn btn-sm btn-outline border-gray-300 text-gray-700"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>


    );
}
