import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import FailedToLoad from "./FailedToLoad";

const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, { params: { page: 1, limit: 8 } });
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
        <div className="flex items-center gap-4 mt-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

const PostLists = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { data: postsData, isLoading, isError } = useQuery({
        queryKey: ["posts-limited"],
        queryFn: fetchPosts,
    });

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (postsData) setPosts(postsData);
    }, [postsData]);

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    if (isError) return <FailedToLoad />;
    if (!posts?.length && !isLoading) return <p className="text-center mt-6">No posts found</p>;

    const handleVote = async (postId, type) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }

        try {
            const { data } = await axiosSecure.post(`/posts/${postId}/vote`, { type });

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? { ...p, upVote: data.upVote, downVote: data.downVote, upvote_by: data.upvote_by, downvote_by: data.downvote_by }
                        : p
                )
            );
        } catch {
            Swal.fire({ icon: "error", title: "Vote failed, please try again" });
        }
    };

    return (
        <div className="pt-8 pb-4 max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-primary mb-6 px-6" data-aos="fade-up">
                Posts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, idx) => <PostSkeleton key={idx} />)
                    : posts.map((post, idx) => {
                        const userId = user?._id || user?.email;
                        const hasUpvoted = post.upvote_by?.includes(userId);
                        const hasDownvoted = post.downvote_by?.includes(userId);

                        return (
                            <div
                                key={post._id}
                                data-aos={idx % 2 === 0 ? "fade-up" : "fade-up"}
                                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition flex flex-col justify-between h-full"
                                onClick={(e) => {
                                    if (e.target.closest(".vote-btn") || e.target.closest(".comment-btn")) return;
                                    navigate(`/posts/${post._id}`);
                                }}
                            >
                                {/* Author */}
                                <div className="flex items-center mb-3">
                                    <img src={post.authorImage || "/default-avatar.png"} alt={post.authorName || "Unknown"} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                    <div>
                                        <p className="font-semibold text-black truncate">{post.authorName || "Unknown"}</p>
                                        <p className="text-gray-400 text-sm truncate">{new Date(post.creation_time).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-3 flex-grow">
                                    <h3 className="text-lg font-bold mb-2 truncate text-gray-500">{post.postTitle}</h3>
                                    <p className="line-clamp-3 text-gray-500">{post.postDescription}</p>
                                    {post.tag && (
                                        <p className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mt-2">{post.tag}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <button
                                        onClick={() => handleVote(post._id, "upvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasUpvoted ? "text-green-600 font-bold" : "text-gray-600"} hover:text-green-600 transition cursor-pointer`}
                                    >
                                        <FaThumbsUp /> {post.upVote || 0}
                                    </button>
                                    <button
                                        onClick={() => handleVote(post._id, "downvote")}
                                        className={`vote-btn flex items-center gap-1 ${hasDownvoted ? "text-red-600 font-bold" : "text-gray-600"} hover:text-red-600 transition cursor-pointer`}
                                    >
                                        <FaThumbsDown /> {post.downVote || 0}
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

            {!isLoading && posts?.length > 0 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/all-posts")}
                        className="btn btn-primary px-6 py-2 rounded-lg hover:scale-105 transition"
                        data-aos="fade-up"
                    >
                        See All Posts
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostLists;
