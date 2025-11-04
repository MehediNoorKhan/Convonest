import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import FailedToLoad from "./FailedToLoad";

export default function Announcements() {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const fetchAnnouncements = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
        return data;
    };

    const { data: announcements = [], isLoading, isError } = useQuery({
        queryKey: ["announcements"],
        queryFn: fetchAnnouncements,
        staleTime: 1000 * 60 * 5,
    });

    const AnnouncementSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-[220px]" />
    );

    if (isError) return <FailedToLoad />;
    if (announcements.length === 0 && !isLoading)
        return <p className="text-center mt-6">No announcements found</p>;

    return (
        <div className="relative max-w-7xl mx-auto mb-6 pb-4 overflow-hidden">

            {/* Floating Particles */}
            <div className="absolute inset-0 -z-10">
                {Array.from({ length: 30 }).map((_, i) => (
                    <span
                        key={i}
                        className={`absolute w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-float`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                        }}
                    />
                ))}
            </div>

            <h2
                className="text-3xl font-bold text-start text-primary mb-8 mt-4 pl-3 relative"
                data-aos="fade-up"
            >
                Announcements
            </h2>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 relative">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <AnnouncementSkeleton key={i} />)
                    : announcements.slice(0, 6).map((a, index) => (
                        <div
                            key={a._id}
                            data-aos={index % 2 === 0 ? "fade-up" : "fade-up"}
                            className="bg-white/90 rounded-lg shadow-md p-4 hover:shadow-2xl hover:scale-[1.03] transition transform cursor-pointer backdrop-blur-md"
                            onClick={() => navigate(`/announcements/${a._id}`)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={a.authorImage || "/default-avatar.png"}
                                    alt={a.authorName}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{a.authorName}</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(a.creation_time).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900">{a.title}</h3>
                            <p className="text-gray-600">{a.description}</p>
                        </div>
                    ))}
            </div>

            {!isLoading && announcements.length > 0 && (
                <div className="flex justify-center mt-8" data-aos="fade-up">
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
