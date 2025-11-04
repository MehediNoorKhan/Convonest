import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import FailedToLoad from "./FailedToLoad";

const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: 1, limit: 8 },
    });
    return (res.data.posts || []).map((p) => ({
        ...p,
        upVote: p.upVote ?? 0,
        downVote: p.downVote ?? 0,
        comments: p.comments || [],
        upvote_by: p.upvote_by || [],
        downvote_by: p.downvote_by || [],
    }));
};

const PostSkeleton = () => (
    <div className="bg-white dark:bg-white rounded-lg shadow-md p-4 animate-pulse h-full flex flex-col justify-between">
        {/* Top section: author info */}
        <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-100 mr-3"></div>
            <div className="flex-1">
                <div className="w-24 h-3 bg-gray-300 dark:bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-100 rounded"></div>
            </div>
        </div>

        {/* Title & Description */}
        <div className="mb-3 flex-1">
            <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-100 rounded mb-1"></div>
            <div className="w-5/6 h-3 bg-gray-200 dark:bg-gray-100 rounded"></div>
        </div>

        {/* Bottom icons */}
        <div className="flex items-center gap-4 mt-2">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-200 rounded-full"></div>
        </div>
    </div>
);

const PostLists = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: posts, isLoading, isError } = useQuery({
        queryKey: ["posts-limited"],
        queryFn: fetchPosts,
    });

    if (isError) return <FailedToLoad />;
    if (!posts?.length && !isLoading) return <p className="text-center mt-6">No posts found</p>;

    const handleVote = (postId, type) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }
        // vote logic
    };

    return (
        <div className="pt-8 pb-4 max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-primary mb-6 px-6">Posts</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, idx) => <PostSkeleton key={idx} />)
                    : posts.map((post) => {
                        const userId = user?._id || user?.id;
                        const hasUpvoted = post.upvote_by?.includes(userId);
                        const hasDownvoted = post.downvote_by?.includes(userId);

                        return (
                            <div
                                key={post._id}
                                className="bg-white dark:bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition flex flex-col justify-between h-full"
                                onClick={(e) => {
                                    if (e.target.closest(".vote-btn") || e.target.closest(".comment-btn")) return;
                                    navigate(`/posts/${post._id}`);
                                }}
                            >
                                {/* Author Info */}
                                <div className="flex items-center mb-3">
                                    <img
                                        src={post.authorImage || "/default-avatar.png"}
                                        alt={post.authorName || "Unknown"}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-black">{post.authorName || "Unknown"}</p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(post.creation_time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold mb-2 text-gray-500">{post.postTitle || ""}</h3>
                                    <p className="text-gray-500">{post.postDescription || ""}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        onClick={() => handleVote(post._id, "upvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasUpvoted ? "text-green-600 font-bold" : "text-gray-600"} hover:text-green-600 cursor-pointer transition`}
                                    >
                                        <FaThumbsUp /> {post.upVote}
                                    </button>
                                    <button
                                        onClick={() => handleVote(post._id, "downvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasDownvoted ? "text-red-600 font-bold" : "text-gray-600"} hover:text-red-600 cursor-pointer transition`}
                                    >
                                        <FaThumbsDown /> {post.downVote}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/posts/${post._id}`)}
                                        className="comment-btn flex items-center gap-1 text-gray-500 hover:text-blue-600 cursor-pointer transition"
                                    >
                                        <FaComment /> {post.comments?.length || 0}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* See All Posts button */}
            {!isLoading && posts?.length > 0 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/all-posts")}
                        className="btn btn-primary px-6 py-2 rounded-lg hover:scale-105 transition"
                    >
                        See All Posts
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostLists;

