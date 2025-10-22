import React, { useContext, useState } from "react";
import { AuthContext } from "../Components/AuthContext";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function DashboardNavbar({ onMenuClick, showMenuButton }) {
    const { user, logOut } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className="flex items-center justify-between bg-white shadow px-6 py-3 relative">
            {/* Menu button for small screens */}
            {showMenuButton && (
                <button
                    className="text-gray-800 md:hidden mr-3"
                    onClick={onMenuClick}
                >
                    <FaBars size={20} />
                </button>
            )}

            {/* Home link */}
            <a
                href="/"
                className="absolute left-28 cursor-pointer transform -translate-x-1/2 text-blue-600 font-semibold hover:text-purple-600
               md:static md:ml-4 md:transform-none 
               sm:left-4 sm:-translate-x-0"
            >
                Convonest
            </a>

            <div className="flex-1"></div> {/* push profile to right */}

            {/* Profile + Logout */}
            <div className="relative flex items-center gap-3">
                {user && (
                    <>
                        {/* Profile Picture */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => window.innerWidth < 768 && setDropdownOpen(!dropdownOpen)} // toggle only on small screens
                        >
                            <img
                                src={user.photoURL || "https://via.placeholder.com/40"}
                                alt={user.displayName || "User"}
                                className="w-10 h-10 rounded-full object-cover border border-blue-300 hover:ring-2 hover:ring-blue-400"
                            />
                        </div>

                        {/* Logout Button (always visible) */}
                        <button
                            className="btn btn-outline btn-primary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                        {/* Dropdown for small screens only */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50 flex flex-col md:hidden">
                                <div className="px-4 py-2 text-gray-800 font-semibold text-center truncate">
                                    {user.displayName || "User"}
                                </div>
                                <hr className="border-t border-gray-200 my-1" />
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-all duration-200 rounded"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Dashboard
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
