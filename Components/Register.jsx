import React, { useState, useContext } from "react";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import { AuthContext } from "./AuthContext"; // AuthProvider
import { auth } from "../Firebase.config.init";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            toast.warning("Please select an image!", { autoClose: 2000 });
            return;
        }

        setLoading(true);

        // Upload image to ImgBB
        const formData = new FormData();
        formData.append("image", image);
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

        axios
            .post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData)
            .then((res) => {
                const imageUrl = res.data.data.url;

                // Create user in Firebase
                createUser(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Immediately sign out so the user is not logged in automatically
                        auth.signOut();

                        // Update Firebase profile
                        updateUserProfile(fullName, imageUrl)
                            .then(() => {
                                const userData = {
                                    fullName,
                                    email,
                                    avatar: imageUrl,
                                    uid: user.uid,
                                    role: "user",
                                    user_status: "Bronze",
                                    membership: "no",
                                    posts: 0,
                                };

                                // Save user in DB
                                axios
                                    .post(`${import.meta.env.VITE_API_URL}/users`, userData)
                                    .then(() => {
                                        toast.success("Registered successfully!", {
                                            position: "top-right",
                                            autoClose: 2000,
                                        });

                                        // Reset form
                                        setFullName("");
                                        setEmail("");
                                        setPassword("");
                                        setImage(null);
                                    })
                                    .catch((err) => {
                                        console.error("DB Error:", err);
                                        toast.error("Failed to save user info!", {
                                            position: "top-right",
                                            autoClose: 3000,
                                        });
                                    });
                            })
                            .catch((err) => {
                                console.error("Profile update error:", err);
                                toast.error(`Failed to update profile: ${err.message}`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            });
                    })
                    .catch((error) => {
                        console.error("Firebase error:", error);
                        toast.error(`Firebase Error: ${error.message}`, {
                            position: "top-right",
                            autoClose: 3000,
                        });
                    });
            })
            .catch((error) => {
                console.error("ImgBB error:", error);
                toast.error(`Image Upload Failed: ${error.message}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 sm:px-6">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="w-full max-w-sm sm:max-w-md p-6 bg-base-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-primary w-full"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-primary w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-primary w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        onChange={handleImageChange}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="mt-4">
                    <SocialLogin />
                </div>
            </div>
        </div>
    );
};

export default Register;
