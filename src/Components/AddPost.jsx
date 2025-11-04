import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import AddPostSkeleton from "../skeletons/AddPostSkeleton";

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [actualUserData, setActualUserData] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true);

    const { register, handleSubmit, control, reset, setValue, watch } = useForm();
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    const authorImage = watch("authorImage");

    // Fetch tags
    const { data: tags = [], isLoading: loadingTags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tags");
            return res.data.map((tag) => ({ value: tag.name, label: tag.name }));
        },
    });

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;
            try {
                setLoadingUserData(true);
                const res = await axiosSecure.get("/users");
                if (res.data.success && Array.isArray(res.data.data)) {
                    const matchedUser = res.data.data.find(u => u.email === user.email);
                    setActualUserData(matchedUser || null);
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            } finally {
                setLoadingUserData(false);
            }
        };
        fetchUserData();
    }, [user, axiosSecure]);

    // Image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setImageUploaded(false);

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
            });

            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData
            );

            if (res.data.success) {
                setValue("authorImage", res.data.data.url);
                setImageUploaded(true);
            } else throw new Error("Image upload failed");
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Submit
    const onSubmit = async (data) => {
        if (!user) {
            toast.warn("Login required to add a post");
            return;
        }

        try {
            const postData = {
                authorImage: data.authorImage,
                authorName: user.displayName,
                authorEmail: user.email,
                postTitle: data.postTitle,
                postDescription: data.postDescription,
                tag: data.tag,
                upVote: 0,
                downVote: 0,
                upvote_by: [],
                vote: 0,
                downvote_by: [],
                comments: [],
                creation_time: new Date(),
            };

            await axiosSecure.post("/posts", postData);
            toast.success("Post added successfully");
            reset();
            setImageUploaded(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add post");
        }
    };

    if (!user || loadingTags || loadingUserData) return <AddPostSkeleton />;

    // Check post limit for non-members
    const hitLimit = actualUserData?.membership === "no" && actualUserData?.posts >= 5;
    if (hitLimit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold text-red-600">
                        You have hit your limit of adding posts!
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <p className="text-gray-700 text-xl">To add more post</p>
                        <button
                            className="btn btn-outline btn-primary"
                            onClick={() => {
                                toast.info("Redirecting to membership page...");
                                navigate("/membership");
                            }}
                        >
                            Be a Member
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                Add New Post
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Author Name */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Author Name</label>
                    <input
                        type="text"
                        value={user.displayName}
                        disabled
                        className="input input-primary w-full"
                    />
                </div>

                {/* Author Email */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Author Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="input input-primary w-full"
                    />
                </div>

                {/* Author Image */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Author Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="input input-primary w-full"
                    />
                </div>
                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Post Title */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Post Title</label>
                    <input
                        type="text"
                        {...register("postTitle", { required: true })}
                        placeholder="Enter Post Title"
                        className="input input-primary w-full"
                    />
                </div>

                {/* Post Description */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Post Description</label>
                    <textarea
                        {...register("postDescription", { required: true })}
                        placeholder="Enter Post Description"
                        className="textarea textarea-primary w-full"
                        rows={4}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col">
                    <label className="text-[#00CCFF] mb-1">Select Tag</label>
                    <select
                        defaultValue="Pick a language"
                        className="select select-primary w-full"
                        {...register("tag", { required: true })}
                    >
                        <option disabled>Pick a Tag</option>
                        {tags.map((tag, idx) => (
                            <option key={idx} value={tag.value}>{tag.label}</option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!imageUploaded || uploading}
                >
                    {uploading ? "Image Uploading..." : "Add Post"}
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AddPost;
