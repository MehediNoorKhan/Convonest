import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import FailedToLoad from "./FailedToLoad";

export default function AllAnnouncements() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const fetchAllAnnouncements = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
        return res.data;
    };

    const { data: announcements = [], isLoading, isError } = useQuery({
        queryKey: ["all-announcements"],
        queryFn: fetchAllAnnouncements,
        staleTime: 1000 * 60 * 5,
    });

    const totalPages = Math.ceil(announcements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAnnouncements = announcements.slice(startIndex, startIndex + itemsPerPage);

    const AnnouncementSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-[220px]" />
    );

    if (isError) return <FailedToLoad />;

    return (
        <div className="max-w-7xl mx-auto mb-6 pb-4 mt-4">
            <h2 className="text-3xl font-bold text-primary mb-8 pt-20 pl-4" data-aos="fade-up">
                All Announcements
            </h2>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <AnnouncementSkeleton key={i} />)
                    : currentAnnouncements.length > 0 ? (
                        currentAnnouncements.map((a, index) => (
                            <div
                                key={a._id}
                                data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                                className="bg-white text-gray-700 rounded-lg shadow-md p-4 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={a.authorImage || "/default-avatar.png"}
                                        alt={a.authorName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-black">{a.authorName}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(a.creation_time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                                <p className="text-gray-700">{a.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-2 text-center text-gray-700 mt-6">
                            No announcements found
                        </p>
                    )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow disabled:opacity-50 transition"
                    >
                        Prev
                    </button>

                    <span className="text-gray-800">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
