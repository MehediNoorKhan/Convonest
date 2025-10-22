import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FailedToLoad from "./FailedToLoad";

export default function Announcements() {
    const fetchAnnouncements = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
        return data;
    };

    const { data: announcements = [], isLoading, isError } = useQuery({
        queryKey: ["announcements"],
        queryFn: fetchAnnouncements,
        staleTime: 1000 * 60 * 5,
    });

    // 💀 Skeleton loader
    const AnnouncementSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md p-4 mx-2 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-2/5 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
    );

    if (isError) return <FailedToLoad />;
    if (announcements.length === 0 && !isLoading) return <p className="text-center mt-6"></p>;

    return (
        <div className="max-w-7xl mx-auto mb-6 pb-4">
            <h2 className="text-3xl font-bold text-start text-primary mb-8 mt-4 pl-3">Announcements</h2>

            <div className="space-y-6">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <AnnouncementSkeleton key={i} />)
                    : announcements.map((a) => (
                        <div key={a._id} className="bg-white rounded-lg shadow-md p-4 mx-2">
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={a.authorImage || "/default-avatar.png"}
                                    alt={a.authorName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">{a.authorName}</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(a.creation_time).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                            <p className="text-gray-700">{a.description}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
