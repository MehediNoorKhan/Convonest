import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";

export default function Banner({ selectedTag }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [results, setResults] = useState([]);
    const [noResult, setNoResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expectedCount, setExpectedCount] = useState(3);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const searchMutation = useMutation({
        mutationFn: async (tag) => {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/posts/search`, { tag });
            return data.posts || [];
        },
        onMutate: () => {
            setLoading(true);
            setResults([]);
            setNoResult(false);
            setExpectedCount(3);
        },
        onSuccess: (data) => {
            setLoading(false);
            if (data.length === 0) setTimeout(() => setNoResult(true), 100);
            else {
                setResults(data);
                setExpectedCount(data.length);
                setNoResult(false);
            }
        },
        onError: () => {
            setResults([]);
            setLoading(false);
            setTimeout(() => setNoResult(true), 500);
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
        setResults([]);
        setNoResult(false);
        setSearchTerm("");
        setSearchedTerm("");
    };

    const handleVote = async (postId, type) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }
        try {
            const { data } = await axiosSecure.patch(`/posts/${postId}/vote`, {
                type,
                userEmail: user.email,
            });
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

    // Determine section height dynamically
    const getSectionHeight = () => {
        if (loading) return "min-h-[350px] sm:min-h-[450px]"; // show skeleton nicely
        if (results.length > 0) return "h-auto"; // auto height according to posts
        if (noResult) return "h-auto"; // auto height for no post found
        return "min-h-[50px] sm:min-h-[50px] md:max-h-[200px]"; // initial small height
    };



    return (
        <div
            className={`w-full pt-20 pb-4 transition-all duration-500 ${getSectionHeight()} bg-base-200`}
        >
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto text-center space-y-4 px-4 sm:px-6">
                <form onSubmit={handleSearch} className="flex flex-wrap justify-center mt-6 gap-2">
                    <input
                        type="text"
                        placeholder="Search by Tag"
                        className="input input-primary text-black w-full sm:w-64 md:w-1/2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-soft btn-primary flex-1 sm:flex-none">
                        Search
                    </button>
                    {(results.length > 0 || noResult) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn btn-outline btn-error hover:text-white flex-1 sm:flex-none"
                        >
                            ✕ Clear
                        </button>
                    )}
                </form>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-8">
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: Math.min(expectedCount, 6) }).map((_, idx) => (
                            <div key={idx} className="skeleton h-80 w-full rounded-lg" />
                        ))}
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 pb-6">
                        {results.map((post) => {
                            const userId = user?._id || user?.id;
                            const hasUpvoted = post.upvote_by?.includes(userId);
                            const hasDownvoted = post.downvote_by?.includes(userId);

                            return (
                                <div
                                    key={post._id}
                                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between h-full"
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
                                            <p className="font-semibold truncate">{post.authorName || "Unknown"}</p>
                                            <p className="text-gray-500 text-sm truncate">{new Date(post.creation_time).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-3 flex-grow">
                                        <h3 className="text-lg font-bold mb-2 truncate">{post.postTitle}</h3>
                                        <p className="text-gray-700 line-clamp-3">{post.postDescription}</p>
                                        {post.tag && (
                                            <p className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mt-2">
                                                {post.tag}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 mt-2">
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
