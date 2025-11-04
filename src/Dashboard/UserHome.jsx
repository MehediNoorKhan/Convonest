import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaPenFancy, FaComments, FaVoteYea } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AuthContext } from "../Components/AuthContext";
import UserHomeSkeleton from "../skeletons/UserHomeSkeleton";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function UserHome() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({ posts: 0, comments: 0, votes: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/users/home-stats?email=${user.email}`);
                setStats({
                    posts: res.data.posts || 0,
                    comments: res.data.comments || 0,
                    votes: res.data.votes || 0,
                });

                // 🔹 Toast for successful fetch

            } catch (err) {
                console.error("Failed to fetch user stats:", err);
                setStats({ posts: 0, comments: 0, votes: 0 });

                // 🔹 Toast for error
                MySwal.fire({
                    icon: "error",
                    title: "Failed to load stats",
                    text: err.message || "Something went wrong!",
                    toast: true,
                    position: "top-right",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, axiosSecure]);

    if (loading) return <UserHomeSkeleton />;

    const cardData = [
        {
            label: "Posts",
            value: stats.posts,
            icon: <FaPenFancy size={30} className="text-white" />,
            bgColor: "bg-purple-500",
        },
        {
            label: "Comments",
            value: stats.comments,
            icon: <FaComments size={30} className="text-white" />,
            bgColor: "bg-green-500",
        },
        {
            label: "Total Votes",
            value: stats.votes,
            icon: <FaVoteYea size={30} className="text-white" />,
            bgColor: "bg-yellow-500",
        },
    ];

    const barData = {
        labels: ["Posts", "Comments", "Total Votes"],
        datasets: [
            {
                label: "Your Stats",
                data: [stats.posts, stats.comments, stats.votes],
                backgroundColor: ["#7c3aed", "#16a34a", "#f59e0b"],
                borderRadius: 10,
                maxBarThickness: 50,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
        },
        animation: {
            duration: 1500,
            easing: "easeOutQuart",
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Animated Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cardData.map((card, index) => (
                    <motion.div
                        key={card.label}
                        className={`flex flex-col items-center justify-center rounded-lg shadow-lg p-6 ${card.bgColor}`}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                    >
                        <div className="mb-4">{card.icon}</div>
                        <motion.div
                            className="text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.2 }}
                        >
                            {card.value}
                        </motion.div>
                        <div className="text-white/90 mt-2">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Animated Bar Chart */}
            <motion.div
                className="bg-white p-6 rounded shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
                <Bar data={barData} options={barOptions} />
            </motion.div>
        </div>
    );
}
