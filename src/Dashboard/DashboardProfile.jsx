import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import DashboardProfileSkeleton from "../skeletons/DashboardProfileSkeleton";
import { motion } from "framer-motion";
import {
    FaRegCalendarAlt,
    FaRegClock,
    FaThumbsUp,
    FaThumbsDown,
    FaRegCommentDots,
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function DashboardProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aboutMeEdit, setAboutMeEdit] = useState(false);
    const [aboutMeText, setAboutMeText] = useState("");

    // Fetch profile data
    useEffect(() => {
        if (!user?.email) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/users/profile", {
                    params: { email: user.email },
                });
                const data = res.data || {};
                setProfile(data);
                setAboutMeText(data.aboutMe || "");
            } catch (err) {
                console.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, axiosSecure]);

    // Update About Me
    const handleAboutMeSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosSecure.put("/users/aboutme", { aboutMe: aboutMeText });
            if (res.data?.aboutMe !== undefined) {
                setProfile((prev) => ({ ...prev, aboutMe: res.data.aboutMe }));
                setAboutMeEdit(false);

                // 🔹 Beautiful toast
                MySwal.fire({
                    icon: "success",
                    title: "About Me updated successfully!",
                    toast: true,
                    position: "top-right",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "Failed to update About Me",
                    toast: true,
                    position: "top-right",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (err) {
            MySwal.fire({
                icon: "error",
                title: "Failed to update About Me",
                toast: true,
                position: "top-right",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    // Upvote/Downvote
    const handleVote = async (postId, type) => {
        if (!profile?.recentPosts) return;
        try {
            const res = await axiosSecure.post(`/posts/${postId}/vote`, { type });
            setProfile((prev) => ({
                ...prev,
                recentPosts: (prev.recentPosts || []).map((p) =>
                    p._id === postId
                        ? { ...p, upVote: res.data.upVote, downVote: res.data.downVote }
                        : p
                ),
            }));

            // 🔹 Beautiful toast on vote
            MySwal.fire({
                icon: "success",
                title: type === "upvote" ? "Upvoted!" : "Downvoted!",
                toast: true,
                position: "top-right",
                showConfirmButton: false,
                timer: 1200,
            });
        } catch (err) {
            MySwal.fire({
                icon: "error",
                title: "Failed to vote",
                toast: true,
                position: "top-right",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    if (loading) return <DashboardProfileSkeleton />;

    if (!profile) return <p className="text-center mt-10 text-yellow-600">Profile not found</p>;

    const safeAvatar = profile.avatar || "/default-avatar.png";
    const safeFullName = profile.fullName || "Unnamed User";
    const safeEmail = profile.email || "No email";
    const safeStatus = profile.user_status || "Active";
    const safePosts = (profile.recentPosts || []).slice(0, 10);

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            {/* Main Card */}
            <motion.div
                className="bg-white rounded-lg shadow-lg p-6 space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* User Info */}
                <div className="text-center">
                    <motion.img
                        src={safeAvatar}
                        alt={safeFullName}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover shadow-md"
                        whileHover={{ scale: 1.1 }}
                    />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{safeFullName}</h2>
                    <p className="text-gray-600 mt-1">{safeEmail}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-primary bg-primary/20 rounded-full">
                        {safeStatus}
                    </span>
                </div>

                {/* About Me Section */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">About Me</h3>
                    <motion.div
                        className="bg-[#F0F8FF] p-5 rounded-lg shadow-inner"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-3">
                            <p className="text-gray-700 whitespace-pre-wrap w-full sm:w-[90%]">
                                {aboutMeEdit ? "" : profile.aboutMe || "No About Me yet."}
                            </p>

                            {!aboutMeEdit && (
                                <button
                                    onClick={() => setAboutMeEdit(true)}
                                    className="text-blue-600 cursor-pointer hover:underline text-sm sm:text-base mt-2 sm:mt-0 self-end"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {aboutMeEdit && (
                            <form onSubmit={handleAboutMeSave} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Write something about yourself"
                                    className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400 border-gray-300"
                                    value={aboutMeText}
                                    onChange={(e) => setAboutMeText(e.target.value)}
                                />
                                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                    <button type="submit" className="btn btn-primary w-full sm:w-auto">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary w-full sm:w-auto"
                                        onClick={() => {
                                            setAboutMeEdit(false);
                                            setAboutMeText(profile.aboutMe || "");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>

                {/* Recent Posts Section */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">Recent Posts</h3>
                    {safePosts.length === 0 && <p className="text-gray-500">No posts found</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {safePosts.map((post, idx) => {
                            const postTitle = post.postTitle || post.title || "Untitled Post";
                            const postDesc = post.postDescription || post.description || "";

                            return (
                                <motion.div
                                    key={post._id || idx}
                                    className="bg-gray-100 cursor-pointer p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    onClick={() => navigate(`/posts/${post._id}`)}
                                >
                                    <h4 className="text-md sm:text-lg font-semibold text-gray-800 line-clamp-1">{postTitle}</h4>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{postDesc}</p>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 gap-2 sm:gap-0">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <FaRegCalendarAlt /> {new Date(post.creation_time).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaRegClock /> {new Date(post.creation_time).toLocaleTimeString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                            <span
                                                className="flex items-center gap-1 text-gray-400 hover:text-green-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVote(post._id, "upvote");
                                                }}
                                            >
                                                <FaThumbsUp /> {post.upVote || 0}
                                            </span>
                                            <span
                                                className="flex items-center gap-1 text-gray-400 hover:text-red-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVote(post._id, "downvote");
                                                }}
                                            >
                                                <FaThumbsDown /> {post.downVote || 0}
                                            </span>
                                            <span
                                                className="flex items-center gap-1 text-gray-400 hover:text-blue-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/posts/${post._id}`);
                                                }}
                                            >
                                                <FaRegCommentDots /> {post.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>

    );
}
