import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAnnouncementSkeleton from "../skeletons/AddAnnouncementsSkeleton";

export default function AddAnnouncement() {
    const { user, loading } = useContext(AuthContext);
    const { register, handleSubmit, setValue, reset, watch } = useForm();
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const authorImage = watch("authorImage");

    const addAnnouncementMutation = useMutation({
        mutationFn: async (announcement) => {
            const { data } = await axiosSecure.post("/announcements", announcement);
            return data;
        },
        onSuccess: () => {
            toast.success("Announcement added successfully!", { position: "top-right", autoClose: 2000 });
            reset();
            setImageUploaded(false);
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to add announcement!", { position: "top-right", autoClose: 2500 });
        },
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.warning("Please select an image first!", { autoClose: 2000 });
            return;
        }

        setUploading(true);
        setImageUploaded(false);

        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                { method: "POST", body: formData }
            );

            const data = await res.json();
            if (data.success) {
                setValue("authorImage", data.data.url);
                setImageUploaded(true);
            } else {
                throw new Error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed!", { autoClose: 1500 });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (formData) => {
        if (!user?.email) {
            toast.warning("Please login to add an announcement!", { autoClose: 2000 });
            return;
        }

        const announcement = {
            authorName: formData.authorName,
            authorEmail: user.email,
            authorImage: formData.authorImage,
            title: formData.title,
            description: formData.description,
            creation_time: new Date(),
        };

        addAnnouncementMutation.mutate(announcement);
    };

    if (loading) return <AddAnnouncementSkeleton />;
    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div
            className="max-w-4xl w-full mx-auto mt-6 mb-8 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl bg-white dark:bg-blue-50 transition-colors duration-500"
        >
            <ToastContainer position="top-right" autoClose={2000} />

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-primary">
                Add Announcement
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Author Name */}
                <div>
                    <label className="block text-sm sm:text-base md:text-lg font-semibold text-[#00CCFF] mb-1 sm:mb-2">
                        Author Name
                    </label>
                    <input
                        type="text"
                        {...register("authorName", { required: true })}
                        placeholder="Enter author name"
                        className="input input-bordered w-full text-gray-500 placeholder-gray-400 bg-white dark:bg-white dark:text-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Author Image */}
                <div>
                    <label className="block text-sm sm:text-base md:text-lg font-semibold text-[#00CCFF] mb-1 sm:mb-2">
                        Author Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full bg-white text-gray-500 placeholder-gray-400 dark:text-gray-500 dark:placeholder-gray-400"
                    />
                </div>


                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Title */}
                <div>
                    <label className="block text-sm sm:text-base md:text-lg font-semibold text-[#00CCFF] mb-1 sm:mb-2">
                        Announcement Title
                    </label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        placeholder="Enter announcement title"
                        className="input input-bordered w-full text-gray-500 placeholder-gray-400 bg-white dark:bg-white dark:text-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm sm:text-base md:text-lg font-semibold text-[#00CCFF] mb-1 sm:mb-2">
                        Description
                    </label>
                    <textarea
                        {...register("description", { required: true })}
                        placeholder="Write the announcement details here..."
                        rows={5}
                        className="textarea textarea-bordered w-full text-gray-500 placeholder-gray-400 bg-white dark:bg-white dark:text-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2 sm:pt-4">
                    <button
                        type="submit"
                        disabled={uploading || !imageUploaded || addAnnouncementMutation.isLoading}
                        className={`w-full sm:w-1/2 md:w-1/3 py-2 px-4 rounded font-semibold text-white transition-all duration-300 ${addAnnouncementMutation.isLoading || uploading
                            ? "bg-blue-600 opacity-80 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {addAnnouncementMutation.isLoading
                            ? "Adding..."
                            : uploading
                                ? "Uploading Image..."
                                : "Add Announcement"}
                    </button>
                </div>
            </form>
        </div>

    );
}
