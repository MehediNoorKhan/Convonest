import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import MembershipSkeleton from "../skeletons/MembershipSkeleton";
import { useNavigate } from "react-router";

// ✅ Stripe Public Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Membership({ skeleton }) {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [userStatus, setUserStatus] = useState(null); // Bronze, Gold
    const [userRole, setUserRole] = useState(null); // user, admin
    const [fetchingStatus, setFetchingStatus] = useState(true);

    useEffect(() => {
        if (user?.email) {
            setFetchingStatus(true);
            axiosSecure
                .get(`/users/role/${user.email}`)
                .then(res => {
                    setUserStatus(res.data.user_status || "Bronze");
                    setUserRole(res.data.role || "user");
                })
                .catch(err => {
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

    // ✅ No user logged in: show modal immediately
    if (!user) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">
                        You must log in to be a member
                    </h3>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 shadow hover:scale-105 transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    // ✅ If admin
    if (userRole === "admin") {
        return (
            <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-3xl font-semibold text-primary text-center px-4">
                    You’re an Admin. You don’t need to take membership.
                </p>
            </div>
        );
    }

    // ✅ If already Gold member
    if (userStatus === "Gold") {
        return (
            <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-3xl font-semibold text-primary text-center px-4">
                    You are already a member of our service.
                </p>
            </div>
        );
    }

    // ✅ Show membership purchase option
    return (
        <div className="py-24 px-4 sm:px-6 md:px-10 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-xl w-full px-6 sm:px-8 md:px-10 py-8 sm:py-10 rounded-2xl bg-white shadow-lg text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
                    Upgrade to Gold Membership
                </h2>

                <p className="mb-6 text-blue-500 text-sm sm:text-base">
                    Get exclusive access by upgrading to{" "}
                    <span className="font-semibold text-blue-600">Gold</span> for only{" "}
                    <span className="text-purple-600">$10</span>.
                </p>

                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
}
