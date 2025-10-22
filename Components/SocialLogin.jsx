import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../Firebase.config.init";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const uploadToImgbb = async (imageUrl) => {
        try {
            const formData = new FormData();
            formData.append("image", imageUrl);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            return res.data.data.display_url;
        } catch (err) {
            console.error("Image upload error:", err);
            toast.error("Image upload failed, using original photo!");
            return imageUrl; // fallback to original
        }
    };

    const handleGoogleLogin = () => {
        googleLogin(auth)
            .then(async (result) => {
                const user = result.user;
                const additionalUserInfo = getAdditionalUserInfo(result);

                // Upload Google photoURL to imgbb
                let avatarUrl = user.photoURL;
                if (avatarUrl) {
                    avatarUrl = await uploadToImgbb(avatarUrl);
                }

                // Save user in DB only if first-time login
                if (additionalUserInfo.isNewUser) {
                    const userData = {
                        fullName: user.displayName,
                        email: user.email,
                        avatar: avatarUrl,
                        uid: user.uid,
                        role: "user",
                        user_status: "Bronze",
                        membership: "no",
                        posts: 0,
                    };

                    try {
                        await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);
                        toast.success("Registered via Google successfully!");
                    } catch (err) {
                        console.error("DB Error:", err);
                        toast.error("Failed to save user info!");
                        return;
                    }
                } else {
                    toast.success("You've logged in successfully!");
                }

                // Navigate after login
                navigate("/");
            })
            .catch((error) => {
                console.error("Google login error:", error);
                toast.error("Google login failed!");
            });
    };

    return (
        <>
            <button
                onClick={handleGoogleLogin}
                className="btn bg-white text-black border-[#e5e5e5] w-full flex items-center justify-center gap-2 mt-3"
            >
                <svg
                    aria-label="Google logo"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <g>
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path
                            fill="#34a853"
                            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                        ></path>
                        <path
                            fill="#4285f4"
                            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                        ></path>
                        <path
                            fill="#fbbc02"
                            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                        ></path>
                        <path
                            fill="#ea4335"
                            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                        ></path>
                    </g>
                </svg>
                Login with Google
            </button>
            <Toaster position="top-center" reverseOrder={false} />
        </>
    );
};

export default SocialLogin;
