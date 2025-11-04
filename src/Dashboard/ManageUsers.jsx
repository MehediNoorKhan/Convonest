import { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AdminDashboardSkeleton from "../Skeletons/AdminDashboardSkeleton";
import FailedToLoad from "../Components/FailedToLoad";

const MySwal = withReactContent(Swal);

export default function ManageUsers() {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/users");
                if (res.data.success) {
                    setUsers(res.data.data);
                } else {
                    setError("Failed to fetch users");
                }
            } catch (err) {
                console.error(err);
                setError("Error loading users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [axiosSecure]);

    const makeAdmin = async (userId, userName) => {
        const result = await MySwal.fire({
            title: "Make Admin?",
            text: `Are you sure you want to make ${userName} an admin?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, make admin",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/make-admin/${userId}`);
            if (res.data.success) {
                setUsers((prev) =>
                    prev.map((u) => (u._id === userId ? { ...u, role: "admin" } : u))
                );

                MySwal.fire({
                    icon: "success",
                    title: "Success!",
                    text: `${userName} is now an admin!`,
                    toast: true,
                    position: "top-right",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Failed to update user role",
                });
            }
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Error updating user role",
            });
        }
    };

    if (loading) return <AdminDashboardSkeleton />;
    if (error) return <FailedToLoad message={error} />;
    if (!users.length)
        return <p className="text-center mt-6 text-gray-500">No users found.</p>;

    return (
        <div className="relative overflow-x-auto sm:rounded-lg max-w-7xl mx-auto mt-6 p-2 sm:p-4 md:p-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-start">
                Manage Users
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Name</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3">Email</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Role</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Change Role</th>
                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-center">Subscription</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2 sm:space-y-3">
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-lg transform transition-all duration-300 hover:bg-[#E0FFFF] hover:shadow-xl opacity-0 animate-fadeIn"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                            >
                                {/* Name */}
                                <td className="px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-3">
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {user.fullName}
                                    </span>
                                </td>

                                {/* Email */}
                                <td className="px-4 py-2 sm:px-6 sm:py-3">{user.email}</td>

                                {/* Role */}
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium text-center ${user.role === "admin"
                                            ? "bg-green-100 text-green-700"
                                            :
                                            "bg-yellow-100 text-yellow-600"

                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>

                                {/* Make Admin */}
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    {user.role === "admin" ? (
                                        <span className="text-green-600 font-semibold text-sm sm:text-base">
                                            Admin
                                        </span>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => makeAdmin(user._id, user.fullName)}
                                        >
                                            Make Admin
                                        </button>
                                    )}
                                </td>

                                {/* Subscription */}
                                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                    {user.membership === "yes" ? (
                                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 text-center">
                                            Gold
                                        </span>
                                    ) : user.membership === "no" ? (
                                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-center">
                                            Bronze
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-center">
                                            {user.user_status || "User"}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes fadeIn {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
            `}</style>
        </div>
    );
}
