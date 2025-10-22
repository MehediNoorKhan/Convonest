import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Components/AuthContext";

export default function RoleBasedRedirect() {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user && role) {
            if (role === "admin") navigate("/dashboard/adminhome", { replace: true });
            else if (role === "user") navigate("/dashboard/userhome", { replace: true });
        }
    }, [loading, user, role, navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Redirecting...</p>
        </div>
    );
}
