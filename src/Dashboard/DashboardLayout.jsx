import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
    FaBars,
    FaTimes,
    FaHome,
    FaUser,
    FaPlus,
    FaUsers,
    FaBullhorn,
    FaFlag,
    FaCommentDots,
} from "react-icons/fa";
import { useAuth } from "../Components/AuthContext";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "../Components/Footer";

// ...imports remain the same

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, role, loading } = useAuth();
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (loading || role === null) {
        return (
            <div className="flex flex-col md:flex-row h-screen bg-gray-100 animate-pulse">
                <aside className="w-full md:w-64 bg-gray-200 min-h-[200px] md:min-h-full p-4 space-y-4 rounded-md"></aside>
                <div className="flex-1 flex flex-col p-4 space-y-4">
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-4">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="h-20 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">
                        Please log in to access the dashboard.
                    </p>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const isPostCommentsPage = location.pathname.includes("/dashboard/posts/"); // or "/dashboard/myposts/comments" if you use that route

    const sidebarLinks = [
        { name: "Home", path: "/dashboard", icon: <FaHome />, roles: ["user", "admin"] },
        { name: "Profile", path: "/dashboard/profile", icon: <FaUser />, roles: ["user"] },
        { name: "Add Post", path: "/dashboard/addpost", icon: <FaPlus />, roles: ["user"] },
        { name: "My Posts", path: "/dashboard/myposts", icon: <FaBullhorn />, roles: ["user"] },
        { name: "Admin Profile", path: "/dashboard/adminprofile", icon: <FaUser />, roles: ["admin"] },
        { name: "Manage Users", path: "/dashboard/manageusers", icon: <FaUsers />, roles: ["admin"] },
        { name: "Announcements", path: "/dashboard/addannouncement", icon: <FaBullhorn />, roles: ["admin"] },
        { name: "Reported Comments", path: "/dashboard/reportedcomments", icon: <FaFlag />, roles: ["admin"] },
    ].filter(link => role && link.roles.includes(role));

    // Sub-link for Post Comments (visible only when viewing a post's comments)
    const subLinks = isPostCommentsPage
        ? [
            {
                name: "Post Comments",
                path: location.pathname, // current post comments URL
                icon: <FaCommentDots />,
            },
        ]
        : [];
    const getActive = (path) => {
        // If current location matches path → active
        if (location.pathname === path) return true;
        // If none matches (like first load), default Home is active
        const paths = sidebarLinks.map(link => link.path);
        if (!paths.includes(location.pathname) && path === "/dashboard") return true;
        return false;
    };
    // Sidebar for medium and large screens
    // Desktop Sidebar
    const Sidebar = () => (
        <aside className="hidden md:flex flex-col bg-white text-gray-500 w-64 h-screen shadow-lg border-r border-gray-200">
            <div className="text-2xl font-bold p-6 text-blue-600">Dashboard</div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {sidebarLinks.map(link => {
                    const active = getActive(link.path);
                    return (
                        <div key={link.name}>
                            <Link
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer transition
                    ${active ? "bg-blue-100 text-blue-800 font-semibold" : "hover:bg-blue-50 hover:text-blue-700"}`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                            {/* Render sub-links if any */}
                            {link.name === "My Posts" && subLinks.length > 0 && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {subLinks.map(sublink => (
                                        <Link
                                            key={sublink.name}
                                            to={sublink.path}
                                            className={`flex items-center gap-2 px-4 py-1 rounded text-sm transition
                                ${location.pathname === sublink.path ? "bg-blue-200 text-blue-900 font-semibold" : "hover:bg-blue-100 hover:text-blue-800"}`}
                                        >
                                            {sublink.icon}
                                            <span>{sublink.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );

    // Mobile Sidebar
    const MobileSidebar = () => (
        <div
            className={`fixed inset-0 z-50 flex md:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}
        >
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${sidebarOpen ? "opacity-50" : "opacity-0"
                    }`}
                onClick={toggleSidebar}
            ></div>
            <aside
                className={`relative w-64 bg-white text-gray-500 shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-blue-600">Dashboard</span>
                    <button onClick={toggleSidebar} className="cursor-pointer">
                        <FaTimes size={20} />
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    {sidebarLinks.map(link => (
                        <div key={link.name}>
                            <Link
                                to={link.path}
                                onClick={toggleSidebar}
                                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition
                ${location.pathname === link.path ? "bg-blue-100 text-blue-800 font-semibold" : "hover:bg-blue-50 hover:text-blue-700"}`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>

                            {/* Sub-links for My Posts */}
                            {link.name === "My Posts" && subLinks.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {subLinks.map(sublink => (
                                        <Link
                                            key={sublink.name}
                                            to={sublink.path}
                                            onClick={toggleSidebar}
                                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition
                            ${location.pathname === sublink.path ? "bg-blue-200 text-blue-900 font-semibold" : "hover:bg-blue-100 hover:text-blue-800"}`}
                                        >
                                            {sublink.icon}
                                            <span>{sublink.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

            </aside>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            <Sidebar />
            <MobileSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar onMenuClick={toggleSidebar} showMenuButton />
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
