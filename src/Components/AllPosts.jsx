import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AOS from "aos";
import 'aos/dist/aos.css';
import { AuthContext } from "./AuthContext";
import FailedToLoad from "./FailedToLoad";

// Fetch posts from API
const fetchPosts = async ({ queryKey }) => {
    const [_key, { popularity, page }] = queryKey;
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { sort: popularity ? "popularity" : undefined, page, limit: 10 },
    });
    return {
        posts: res.data.posts || [],
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
    };
};

// Skeleton Loader
const PostSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-full flex flex-col justify-between">
        <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div className="flex-1">
                <div className="w-24 h-3 bg-gray-300 rounded mb-2"></div>
                <div className="w-16 h-2 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="mb-3 flex-1">
            <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-3 bg-gray-200 rounded mb-1"></div>
            <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const AllPosts = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["all-posts", { popularity: activeTab === 2, page: currentPage }],
        queryFn: fetchPosts,
        keepPreviousData: true,
    });

    useEffect(() => {
        AOS.init({ duration: 900, easing: "ease-in-out", once: true });
    }, []);

    if (isError) return <FailedToLoad />;

    const handleVote = (postId, type) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }
        // vote logic here
    };

    return (
        <div className="relative pt-8 pb-10 mt-12 max-w-7xl mx-auto overflow-hidden">

            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 animate-gradientMove pointer-events-none -z-10"></div>

            {/* Header + Sorting */}
            <div
                className="relative flex justify-between items-center mb-6 px-6"
                data-aos="fade-down"
            >
                <h2 className="text-3xl font-bold text-primary">All Posts</h2>
                <div className="flex gap-2" data-aos="fade-left">
                    <button
                        className={activeTab === 1 ? "btn btn-primary" : "btn btn-outline btn-primary"}
                        onClick={() => { setActiveTab(1); setCurrentPage(1); }}
                    >
                        Latest
                    </button>
                    <button
                        className={activeTab === 2 ? "btn btn-primary" : "btn btn-outline btn-primary"}
                        onClick={() => { setActiveTab(2); setCurrentPage(1); }}
                    >
                        Popular
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {isLoading
                    ? Array.from({ length: 10 }).map((_, idx) => <PostSkeleton key={idx} />)
                    : data.posts.map((post, index) => {
                        const userId = user?._id || user?.id;
                        const hasUpvoted = post.upvote_by?.includes(userId);
                        const hasDownvoted = post.downvote_by?.includes(userId);

                        return (
                            <div
                                key={post._id}
                                data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                                className="bg-white/90 dark:bg-white/80 text-gray-700 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition transform flex flex-col justify-between backdrop-blur-md"
                                onClick={(e) => {
                                    if (e.target.closest(".vote-btn") || e.target.closest(".comment-btn")) return;
                                    navigate(`/posts/${post._id}`);
                                }}
                            >
                                <div className="flex items-center mb-3">
                                    <img
                                        src={post.authorImage || "/default-avatar.png"}
                                        alt={post.authorName}
                                        className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{post.authorName || "Unknown"}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(post.creation_time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h3 className="text-lg font-bold mb-2 text-gray-900">{post.postTitle}</h3>
                                    <p className="text-gray-600">{post.postDescription}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        onClick={() => handleVote(post._id, "upvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasUpvoted ? "text-green-600 font-bold" : "text-gray-600"} hover:text-green-600 transition`}
                                    >
                                        <FaThumbsUp /> {post.upVote}
                                    </button>
                                    <button
                                        onClick={() => handleVote(post._id, "downvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasDownvoted ? "text-red-600 font-bold" : "text-gray-600"} hover:text-red-600 transition`}
                                    >
                                        <FaThumbsDown /> {post.downVote}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/posts/${post._id}`)}
                                        className="comment-btn flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                                    >
                                        <FaComment /> {post.comments?.length || 0}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Pagination */}
            {!isLoading && (
                <div
                    className="relative flex justify-center items-center gap-2 mt-8 pb-6"
                    data-aos="fade-up"
                >
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow disabled:opacity-50 transition"
                    >
                        Prev
                    </button>
                    <span className="px-4 text-gray-800">
                        Page {currentPage} of {data.totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.totalPages))}
                        disabled={currentPage === data.totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllPosts;
