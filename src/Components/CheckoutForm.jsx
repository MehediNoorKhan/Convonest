// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "./AuthContext";
// import useAxiosSecure from "./useAxiosSecure";
// import Swal from "sweetalert2";

// export default function CheckoutForm() {
//     const stripe = useStripe();
//     const elements = useElements();
//     const { user, loading: userLoading } = useContext(AuthContext);
//     const axiosSecure = useAxiosSecure();

//     const [clientSecret, setClientSecret] = useState("");
//     const [loading, setLoading] = useState(false);

//     const price = 1000; // $10 in cents

//     // ✅ Create PaymentIntent only when user data is ready
//     useEffect(() => {
//         if (!user || userLoading) return;

//         axiosSecure
//             .post("/create-payment-intent", { amount: price })
//             .then(res => setClientSecret(res.data.clientSecret))
//             .catch(err => console.error("PaymentIntent error:", err));
//     }, [axiosSecure, user, userLoading]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;

//         const card = elements.getElement(CardElement);
//         if (!card) {
//             Swal.fire("Error", "Card information is missing", "error");
//             return;
//         }

//         setLoading(true);

//         try {
//             const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
//                 type: "card",
//                 card,
//                 billing_details: {
//                     name: user?.displayName || "Anonymous",
//                     email: user?.email,
//                 },
//             });

//             if (pmError) {
//                 Swal.fire("Error", pmError.message, "error");
//                 setLoading(false);
//                 return;
//             }

//             const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: paymentMethod.id,
//             });

//             if (confirmError) {
//                 Swal.fire("Payment Failed", confirmError.message, "error");
//                 setLoading(false);
//                 return;
//             }

//             if (paymentIntent.status === "succeeded") {
//                 const transactionData = {
//                     email: user?.email,
//                     amount: paymentIntent.amount / 100,
//                     transactionId: paymentIntent.id,
//                     cardType: paymentMethod.card.brand,
//                     cardOwner: paymentMethod.billing_details.name,
//                 };

//                 await axiosSecure.post("/save-payment", transactionData);

//                 Swal.fire("Success", "You are now a Gold Member!", "success");
//             }
//         } catch (err) {
//             console.error("Payment error:", err);
//             Swal.fire("Error", "Something went wrong", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Show a loader until user and clientSecret are ready
//     if (userLoading || !user || !clientSecret) {
//         return (
//             <div className="animate-pulse h-48 bg-gray-200 rounded-md w-full max-w-md mx-auto" />
//         );
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-6">
//             <div className="p-3 border rounded-md bg-white w-full">
//                 <CardElement
//                     options={{
//                         style: {
//                             base: {
//                                 fontSize: "16px",
//                                 color: "#000",
//                                 "::placeholder": { color: "#888" },
//                             },
//                             invalid: { color: "#e53e3e" },
//                         },
//                     }}
//                 />
//             </div>

//             <button
//                 type="submit"
//                 disabled={!stripe || !elements || loading}
//                 className={`btn btn-primary w-full py-3 text-lg sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//             >
//                 {loading ? "Processing..." : "Pay $10"}
//             </button>
//         </form>
//     );
// }




import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const price = 1000; // $10 in cents

    // ✅ Create PaymentIntent after user email is ready
    useEffect(() => {
        if (!user?.email) return;
        axiosSecure
            .post("/create-payment-intent", { amount: price })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(err => console.error("PaymentIntent error:", err));
    }, [user, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) {
            Swal.fire("Error", "Card information is missing", "error");
            return;
        }

        setLoading(true);

        try {
            const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                type: "card",
                card,
                billing_details: {
                    name: user?.displayName || "Anonymous",
                    email: user?.email,
                },
            });

            if (pmError) {
                Swal.fire("Error", pmError.message, "error");
                setLoading(false);
                return;
            }

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                Swal.fire("Payment Failed", confirmError.message, "error");
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                const transactionData = {
                    email: user?.email,
                    amount: paymentIntent.amount / 100,
                    transactionId: paymentIntent.id,
                    cardType: paymentMethod.card.brand,
                    cardOwner: paymentMethod.billing_details.name,
                };

                await axiosSecure.post("/save-payment", transactionData);

                Swal.fire("Success", "You are now a Gold Member!", "success").then(() => {
                    window.location.reload(); // Refresh to reflect new status
                });
            }
        } catch (err) {
            console.error("Payment error:", err);
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-6">
            <div className="p-3 border rounded-md bg-white w-full">
                <CardElement
                    options={{
                        style: {
                            base: { fontSize: "16px", color: "#000", "::placeholder": { color: "#888" } },
                            invalid: { color: "#e53e3e" },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || !elements || loading || !clientSecret}
                className={`btn btn-primary w-full py-3 text-lg sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                {loading ? "Processing..." : "Pay $10"}
            </button>
        </form>
    );
}

