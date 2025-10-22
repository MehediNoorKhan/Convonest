// import { useEffect } from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import UserRoute from "../Components/UserRoute";
// import MembershipSkeleton from "../skeletons/MembershipSkeleton";
// import { useAuth } from "../Components/AuthContext";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// export default function Membership() {
//     const { user, loading } = useAuth();

//     // Show skeleton while user data is loading
//     if (loading) return <MembershipSkeleton />;

//     // User fetched: if already Gold, show message
//     if (user?.user_status === "Gold") {
//         return (
//             <UserRoute skeleton={<MembershipSkeleton />}>
//                 <div className="py-24 px-4 sm:px-6 md:px-10 min-h-screen flex items-center justify-center bg-gray-100">
//                     <div className="max-w-xl w-full px-6 sm:px-8 md:px-10 py-8 sm:py-10 rounded-2xl bg-white shadow-lg text-center">
//                         <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
//                             You're already a member of our service
//                         </h2>
//                         <p className="text-blue-400 text-sm sm:text-base">
//                             Thank you for being a valued Gold member!
//                         </p>
//                     </div>
//                 </div>
//             </UserRoute>
//         );
//     }

//     // User is not Gold: show payment form
//     return (
//         <UserRoute skeleton={<MembershipSkeleton />}>
//             <div className="py-24 px-4 sm:px-6 md:px-10 min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="max-w-xl w-full px-6 sm:px-8 md:px-10 py-8 sm:py-10 rounded-2xl bg-white shadow-lg text-center">
//                     <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
//                         Upgrade to Gold Membership
//                     </h2>

//                     <p className="mb-6 text-blue-400 text-sm sm:text-base">
//                         Get exclusive access by upgrading to{" "}
//                         <span className="font-semibold text-blue-600">Gold</span> for only{" "}
//                         <span className="text-purple-600">$10</span>.
//                     </p>

//                     <Elements stripe={stripePromise}>
//                         <CheckoutForm />
//                     </Elements>
//                 </div>
//             </div>
//         </UserRoute>
//     );
// }

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import MembershipSkeleton from "../skeletons/MembershipSkeleton";

// ✅ Stripe Public Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Membership() {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [userStatus, setUserStatus] = useState(null);
    const [fetchingStatus, setFetchingStatus] = useState(true);

    useEffect(() => {
        if (user?.email) {
            setFetchingStatus(true);
            axiosSecure
                .get(`/users/role/${user.email}`)
                .then(res => {
                    setUserStatus(res.data.user_status || "Bronze");
                })
                .catch(err => {
                    console.error("Failed to fetch user status:", err);
                    setUserStatus("Bronze");
                })
                .finally(() => setFetchingStatus(false));
        } else {
            setUserStatus(null);
            setFetchingStatus(false);
        }
    }, [user, axiosSecure]);


    if (loading || fetchingStatus) {
        return <MembershipSkeleton />;
    }

    if (userStatus === "Gold") {
        return (
            <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-3xl font-semibold text-primary">
                    You are already a member of our service.
                </p>
            </div>
        );
    }

    return (
        <div className="py-24 px-4 sm:px-6 md:px-10 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-xl w-full px-6 sm:px-8 md:px-10 py-8 sm:py-10 rounded-2xl bg-white shadow-lg text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
                    Upgrade to Gold Membership
                </h2>

                <p className="mb-6 text-blue-400 text-sm sm:text-base">
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
