import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#1E90FF] text-white py-3 mt-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                {/* Brand */}
                <div className="text-center sm:text-left">
                    <h2 className="text-lg font-bold cursor-pointer hover:text-yellow-400 transition duration-300 text-gray-100">
                        Convonest
                    </h2>
                    <p className="text-sm text-gray-200">
                        Connect, discuss, and share knowledge.
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4 text-xl">
                    <a
                        href="https://facebook.com/mehedinoorkhan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition duration-300 text-gray-100"
                    >
                        <FaFacebook />
                    </a>
                    <a
                        href="https://linkedin.com/in/mehedinoorkhan16/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition duration-300 text-gray-100"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/MehediNoorKhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition duration-300 text-gray-100"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="mt-3 border-t border-blue-400 pt-2 text-center text-sm text-gray-200">
                © {new Date().getFullYear()} Convonest. All rights reserved.
            </div>
        </footer>
    );
}
