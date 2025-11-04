import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-8 mt-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Brand */}
                <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold hover:text-yellow-400 transition cursor-pointer">
                        Convonest
                    </h2>
                    <p className="text-gray-300 mt-1">
                        Connect, discuss, and share knowledge.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <Link to="/" className="hover:text-yellow-400 transition">
                        Home
                    </Link>
                    <Link to="/all-posts" className="hover:text-yellow-400 transition">
                        All Posts
                    </Link>
                    <Link to="/all-announcements" className="hover:text-yellow-400 transition">
                        Announcements
                    </Link>
                    <Link to="/faq" className="hover:text-yellow-400 transition">
                        FAQ
                    </Link>
                    <Link to="/membership" className="hover:text-yellow-400 transition">
                        Membership
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4 text-xl mt-4 md:mt-0">
                    <a
                        href="https://facebook.com/mehedinoorkhan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition"
                    >
                        <FaFacebook />
                    </a>
                    <a
                        href="https://linkedin.com/in/mehedinoorkhan16/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/MehediNoorKhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="mt-6 border-t border-blue-700 pt-4 text-center text-gray-300 text-sm">
                © {new Date().getFullYear()} Convonest. All rights reserved.
            </div>
        </footer>
    );
}
