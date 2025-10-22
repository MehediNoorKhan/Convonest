import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosSecure from "./axiosSecure"; // secure axios instance
import SocialLogin from "./SocialLogin"; // ✅ your SocialLogin component

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
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="input input-primary w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="input input-primary w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* ✅ Social login with Google */}
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
