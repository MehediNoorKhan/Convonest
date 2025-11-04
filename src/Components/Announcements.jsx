import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import FailedToLoad from "./FailedToLoad";

export default function Announcements() {
    const navigate = useNavigate();

    const fetchAnnouncements = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
        return data;
    };

    const { data: announcements = [], isLoading, isError } = useQuery({
        queryKey: ["announcements"],
        queryFn: fetchAnnouncements,
        staleTime: 1000 * 60 * 5,
    });

    // Skeleton loader
    const AnnouncementSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-[220px]" />
    );

    if (isError) return <FailedToLoad />;
    if (announcements.length === 0 && !isLoading)
        return <p className="text-center mt-6">No announcements found</p>;

    return (
        <div className="max-w-7xl mx-auto mb-6 pb-4">
            <h2 className="text-3xl font-bold text-start text-primary mb-8 mt-4 pl-3">
                Announcements
            </h2>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <AnnouncementSkeleton key={i} />)
                    : announcements.slice(0, 6).map((a) => (
                        <div
                            key={a._id}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={a.authorImage || "/default-avatar.png"}
                                    alt={a.authorName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-black">{a.authorName}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(a.creation_time).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-500">{a.title}</h3>
                            <p className="text-gray-500">{a.description}</p>
                        </div>
                    ))}
            </div>

            {/* See All Announcements Button */}
            {!isLoading && announcements.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate("/all-announcements")}
                        className="btn btn-primary px-6 py-2 rounded-lg hover:scale-105 transition"
                    >
                        See All Announcements
                    </button>
                </div>
            )}
        </div>
    );
}
