import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import MembershipSkeleton from "../skeletons/MembershipSkeleton";
import { useNavigate } from "react-router";
import Lottie from "lottie-react";

// ✅ Stripe Public Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Membership({ skeleton }) {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [userStatus, setUserStatus] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [fetchingStatus, setFetchingStatus] = useState(true);
    const [membershipAnimation, setMembershipAnimation] = useState(null);

    // ✅ Load Lottie JSON from public folder
    useEffect(() => {
        fetch("/membership.json")
            .then((res) => res.json())
            .then((data) => setMembershipAnimation(data))
            .catch((err) => console.error("Failed to load membership animation:", err));
    }, []);

    useEffect(() => {
        if (user?.email) {
            setFetchingStatus(true);
            axiosSecure
                .get(`/users/role/${user.email}`)
                .then((res) => {
                    setUserStatus(res.data.user_status || "Bronze");
                    setUserRole(res.data.role || "user");
                })
                .catch((err) => {
                    console.error("Failed to fetch user status:", err);
                    setUserStatus("Bronze");
                    setUserRole("user");
                })
                .finally(() => setFetchingStatus(false));
        } else {
            setUserStatus(null);
            setUserRole(null);
            setFetchingStatus(false);
        }
    }, [user, axiosSecure]);

    if (loading || fetchingStatus) return skeleton;

    if (!user) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">
                        You must log in to be a member
                    </h3>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (userRole === "admin") {
        return (
            <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-3xl font-semibold text-blue-700 text-center px-4">
                    You’re an Admin. You don’t need membership.
                </p>
            </div>
        );
    }

    if (userStatus === "Gold") {
        return (
            <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-3xl font-semibold text-blue-700 text-center px-4">
                    You are already a Gold member. 🎉
                </p>
            </div>
        );
    }

    return (
        <div className="py-24 px-6 min-h-screen bg-gray-100 flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Left: Membership Form */}
            <div className="max-w-md w-full p-8 rounded-2xl bg-white shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-4 text-blue-700">
                    Upgrade to Gold Membership
                </h2>
                <p className="mb-6 text-blue-500">
                    Get exclusive access by upgrading to{" "}
                    <span className="font-semibold text-blue-600">Gold</span> for only{" "}
                    <span className="text-purple-600">$10</span>.
                </p>

                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>

            {/* Right: Animation */}
            {membershipAnimation && (
                <div className="w-full max-w-md flex justify-center">
                    <Lottie
                        animationData={membershipAnimation}
                        loop={true}
                        className="w-full h-[400px] md:h-[450px]"
                    />
                </div>
            )}
        </div>
    );
}
