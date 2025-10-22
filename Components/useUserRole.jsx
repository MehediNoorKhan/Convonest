import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAxiosSecure from "./useAxiosSecure";

export default function useUserRole() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser?.email) {
                try {
                    const email = currentUser.email.toLowerCase();
                    const res = await axiosSecure.get(`/users/role/${email}`);
                    setRole(res.data?.role || "user"); // fallback to user if role missing
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setRole("user"); // fallback
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [axiosSecure]);

    return [role, loading];
}
