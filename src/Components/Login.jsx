import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosSecure from "./axiosSecure";
import SocialLogin from "./SocialLogin";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await login(email, password);
            const user = userCredential.user;

            const res = await axiosSecure.post("/jwt", { email: user.email });
            const token = res.data.token;

            if (token) {
                localStorage.setItem("access-token", token);

                toast.success("Logged in successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setEmail("");
                setPassword("");
                navigate("/");
            }
        } catch (error) {
            toast.error(`Login failed: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 sm:px-6 transition-all duration-500"
            style={{ backgroundColor: "rgb(245, 245, 245)" }} // light gray like bg-base-200
        >
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-blue-200 rounded-lg shadow-md transition-colors duration-500">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-800">
                    Login
                </h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div>
                        <label className="block mb-1 text-gray-600 dark:text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="input input-bordered w-full bg-white text-gray-500 placeholder-gray-400 transition-colors duration-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block mb-1 text-gray-600 dark:text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="input input-bordered w-full bg-white text-gray-500 placeholder-gray-400 transition-colors duration-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-2 px-4 rounded transition-all
              ${loading
                                ? "bg-blue-600 opacity-80 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Social login */}
                <SocialLogin />

                <p className="text-sm text-center text-gray-500 mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-purple-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
