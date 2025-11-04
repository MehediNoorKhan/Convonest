import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { AuthContext } from "./AuthContext";
import { Bell, Menu, X } from "lucide-react";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/announcements/count`);
        const data = await res.json();
        setAnnouncementCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch announcement count:", err);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Posts", path: "/all-posts" },
    { name: "Announcements", path: "/all-announcements" },
    { name: "Membership", path: "/membership" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-4 md:px-6 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-gray-100"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-blue-500 text-2xl font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Convonest
            </span>
          </Link>
        </div>

        {/* Center - Nav links (hidden on small) */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-2 py-1 font-medium text-gray-500 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#3689E3] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ${isActive(link.path) ? "after:scale-x-100 text-[#3689E3]" : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right - Profile / Bell / Buttons */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="relative cursor-pointer text-gray-500">
              <Bell size={24} />
              {announcementCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {announcementCount}
                </span>
              )}
            </div>
          )}

          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt={user.displayName || "Admin"}
                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-[#3689E3]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50 flex flex-col">
                  <div className="px-4 py-2 text-gray-800 font-semibold text-center truncate">
                    {user.displayName || "Admin"}
                  </div>
                  <hr className="border-t border-gray-200 my-1" />

                  {/* ✅ Membership link for small devices */}
                  <Link
                    to="/membership"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-all duration-200 rounded md:hidden"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Membership
                  </Link>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-all duration-200 rounded"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 transition-all duration-200 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <>
              {/* Hidden on medium and up */}
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <button className="btn btn-primary">Join Us</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-outline btn-primary">Register</button>
                </Link>
              </div>

              {/* ✅ Small device hamburger (only when not logged in) */}
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-600 focus:outline-none"
                >
                  {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

                {menuOpen && (
                  <div className="absolute top-16 right-4 bg-white shadow-lg border border-gray-200 rounded-lg p-4 flex flex-col gap-3 z-50">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <button className="btn btn-primary w-full">Join Us</button>
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                      <button className="btn btn-outline btn-primary w-full">
                        Register
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
