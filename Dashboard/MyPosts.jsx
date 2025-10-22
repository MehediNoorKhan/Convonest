import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import { FaTrash, FaCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MyPostsSkeleton from "../skeletons/MyPostsSkeleton";
import FailedToLoad from "../Components/FailedToLoad";

const MySwal = withReactContent(Swal);

export default function MyPosts() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        if (!user?.email || !axiosSecure) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosSecure.get(`/myposts/${user.email}`);
                if (res.data.success) setPosts(res.data.data || []);
                else setError("Failed to fetch posts");
            } catch (err) {
                console.error("Error fetching posts:", err);
                if (err.response?.status === 403) setError("Access denied.");
                else if (err.response?.status === 401) setError("Login required.");
                else setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, axiosSecure]);

    const deletePost = async (postId) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/posts/${postId}`);
                setPosts(posts.filter((post) => post._id !== postId));

                // 🔹 Toast after successful delete
                MySwal.fire({
                    icon: "success",
                    title: "Post deleted successfully!",
                    toast: true,
                    position: "top-right",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (err) {
                console.error(err);
                MySwal.fire({
                    icon: "error",
                    title: "Failed to delete post.",
                    toast: true,
                    position: "top-right",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    if (loading) return <MyPostsSkeleton />;
    if (error) return <FailedToLoad />;

    if (!posts.length)
        return (
            <div className="max-w-7xl mx-auto">
                <div className="h-[70vh] flex flex-col justify-center items-center py-8 dark:bg-gray-800 rounded text-center">
                    <p className="text-red-500 text-4xl dark:text-gray-300 mb-4">You haven't posted anything yet</p>
                    <button
                        className="btn btn-outline btn-primary mt-2"
                        onClick={() => (window.location.href = "/dashboard/addpost")}
                    >
                        Create Post
                    </button>
                </div>
            </div>
        );

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 rounded dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">My Posts</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3 text-center">Votes</th>
                            <th className="px-6 py-3 text-center">Comment</th>
                            <th className="px-6 py-3 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post, index) => {
                            const safeTitle = post.postTitle || "Untitled Post";
                            const votes = (post.upVote || 0) - (post.downVote || 0);

                            return (
                                <tr
                                    key={post._id || index}
                                    className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 transition"
                                >
                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {safeTitle}
                                    </th>
                                    <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-gray-200">{votes}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="btn btn-outline btn-primary"
                                            onClick={() =>
                                                (window.location.href = `/dashboard/posts/${post._id}`)
                                            }
                                        >
                                            <FaCommentDots /> Comments
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="btn bg-red-500 text-white"
                                            onClick={() => deletePost(post._id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <nav className="flex justify-center mt-6" aria-label="Page navigation example">
                <ul className="inline-flex -space-x-px text-sm">
                    <li>
                        <a
                            href="#"
                            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                        >
                            Previous
                        </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page}>
                            <a
                                href="#"
                                aria-current={page === currentPage ? "page" : undefined}
                                className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === currentPage
                                    ? "text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white"
                                    : ""
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                }}
                            >
                                {page}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href="#"
                            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                        >
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
