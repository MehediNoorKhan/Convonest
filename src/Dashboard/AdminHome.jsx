import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaRegComments, FaRegUser, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import AdminDashboardSkeleton from "../Skeletons/AdminDashboardSkeleton";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

ChartJS.register(ArcElement, Tooltip, Legend);
const MySwal = withReactContent(Swal);

export default function AdminHome() {
    const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchStats() {
            try {
                const [postsRes, commentsRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/posts/count`),
                    axios.get(`${API_BASE}/api/comments/count`),
                    axios.get(`${API_BASE}/api/users/count`),
                ]);

                setStats({
                    posts: postsRes.data.count,
                    comments: commentsRes.data.count,
                    users: usersRes.data.count,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <AdminDashboardSkeleton />;

    const cardData = [
        {
            title: "Total Posts",
            value: stats.posts,
            icon: <FaClipboardList className="text-white text-3xl sm:text-2xl animate-pulse" />,
            gradient: "from-blue-500 to-indigo-500",
        },
        {
            title: "Comments",
            value: stats.comments,
            icon: <FaRegComments className="text-white text-3xl sm:text-2xl animate-pulse" />,
            gradient: "from-green-400 to-emerald-500",
        },
        {
            title: "Users",
            value: stats.users,
            icon: <FaRegUser className="text-white text-3xl sm:text-2xl animate-pulse" />,
            gradient: "from-rose-500 to-pink-500",
        },
    ];

    const pieData = {
        labels: ["Posts", "Comments", "Users"],
        datasets: [
            {
                label: "Site Stats",
                data: [stats.posts, stats.comments, stats.users],
                backgroundColor: ["#4f46e5", "#16a34a", "#dc2626"],
                borderColor: ["#fff", "#fff", "#fff"],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { color: "#374151", font: { size: 12 } },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
            },
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1200,
            easing: "easeInOutCubic",
        },
    };

    return (
        <div className="space-y-8 p-4 sm:p-6 max-w-5xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {cardData.map((item, i) => (
                    <div
                        key={i}
                        className={`p-5 rounded-xl shadow-md bg-gradient-to-r ${item.gradient} text-white flex items-center justify-between transform transition-all duration-500 hover:scale-105 opacity-0 animate-fadeIn`}
                        style={{ animationDelay: `${i * 200}ms`, animationFillMode: "forwards" }}
                    >
                        <div>
                            <p className="text-sm sm:text-md md:text-base font-medium">{item.title}</p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{item.value}</p>
                        </div>
                        <div className="text-white">{item.icon}</div>
                    </div>
                ))}
            </div>

            {/* Pie Chart - White BG in Both Modes */}
            <div
                className="max-w-3xl mx-auto rounded-lg shadow-md p-4 sm:p-6 opacity-0 animate-fadeIn"
                style={{
                    animationDelay: "500ms",
                    animationFillMode: "forwards",
                    height: "400px",
                    backgroundColor: "white",
                    color: "#374151",
                }}
            >
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 text-center">
                    Site Stats Overview
                </h3>
                <Pie data={pieData} options={pieOptions} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease forwards;
                }
            `}</style>
        </div>
    );
}
