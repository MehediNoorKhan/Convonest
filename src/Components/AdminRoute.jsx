import { Navigate, useLocation } from "react-router";
import useUserRole from "./useUserRole";

// ✅ Skeleton imports (you can add or adjust based on your admin pages)
import AdminDashboardSkeleton from "../Skeletons/AdminDashboardSkeleton";
import ManageUsersSkeleton from "../Skeletons/ManageUsersSkeleton";
import ManagePostsSkeleton from "../Skeletons/ManagePostsSkeleton";
import AdminProfileSkeleton from "../Skeletons/AdminProfileSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
    const [role, loading] = useUserRole();
    const location = useLocation();

    // ✅ Function to select proper skeleton for each admin page
    const getSkeleton = () => {
        if (location.pathname.includes("/admin/dashboard")) return <AdminDashboardSkeleton />;
        if (location.pathname.includes("/admin/users")) return <ManageUsersSkeleton />;
        if (location.pathname.includes("/admin/posts")) return <ManagePostsSkeleton />;
        if (location.pathname.includes("/admin/profile")) return <AdminProfileSkeleton />;
    };

    // ✅ Show skeleton while loading role
    if (loading) return getSkeleton();

    // ✅ Role check
    if (role !== "admin") {
        console.log("AdminRoute role is:", role);
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;
