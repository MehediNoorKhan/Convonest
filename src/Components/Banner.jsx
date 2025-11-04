import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import axios from "axios";

export default function Banner({ selectedTag }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // Search mutation
    const searchMutation = useMutation({
        mutationFn: async (tag) => {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/posts/search`, { tag });
            return data.posts || [];
        },
        onMutate: () => {
            setLoading(true);
            setResults([]);
            setNoResult(false);
        },
        onSuccess: (data) => {
            setLoading(false);
            if (!data.length) setNoResult(true);
            else setResults(data);
        },
        onError: () => {
            setLoading(false);
            setResults([]);
            setNoResult(true);
        },
    });

    useEffect(() => {
        if (selectedTag) {
            setSearchTerm(selectedTag);
            setSearchedTerm(selectedTag);
            searchMutation.mutate(selectedTag);
        }
    }, [selectedTag]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;
        setSearchedTerm(trimmed);
        searchMutation.mutate(trimmed);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSearchedTerm("");
        setResults([]);
        setNoResult(false);
    };

    const handleVote = async (postId, type) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }

        try {
            const { data } = await axiosSecure.post(`/posts/${postId}/vote`, { type });

            setResults((prev) =>
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

    const getSectionHeight = () => {
        if (loading) return "min-h-[350px] sm:min-h-[450px]";
        if (results.length > 0 || noResult) return "h-auto";
        return "min-h-[50px] sm:min-h-[50px]";
    };

    return (
        <div className={`w-full pt-20 pb-4 transition-all duration-500 ${getSectionHeight()}`} style={{ backgroundColor: "rgb(245, 245, 245)" }}>
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
                <form onSubmit={handleSearch} className="flex flex-wrap justify-center mt-6 gap-2">
                    <input
                        type="text"
                        placeholder="Search by Tag"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-primary w-full sm:w-64 md:w-1/2 bg-white text-gray-800 border border-gray-300 placeholder-gray-400 focus:outline-none"
                    />
                    <button type="submit" className="btn btn-primary flex-1 sm:flex-none">Search</button>
                    {(results.length > 0 || noResult) && (
                        <button type="button" onClick={handleClear} className="btn btn-outline btn-error flex-1 sm:flex-none">✕ Clear</button>
                    )}
                </form>
            </div>

            {/* Posts Grid */}
            <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-8">
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="skeleton h-80 w-full rounded-lg bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 pb-6">
                        {results.map((post) => {
                            const userId = user?._id || user?.email;
                            const hasUpvoted = post.upvote_by?.includes(userId);
                            const hasDownvoted = post.downvote_by?.includes(userId);

                            return (
                                <div
                                    key={post._id}
                                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer flex flex-col justify-between h-full hover:scale-[1.02] hover:shadow-xl transition-all"
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
                )}

                {!loading && noResult && (
                    <p className="text-error text-center w-full mt-6 text-sm sm:text-base">
                        No post found for “{searchedTerm}”
                    </p>
                )}
            </div>
        </div>
    );
}
