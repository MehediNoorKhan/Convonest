import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import useUserRole from "../Components/useUserRole";
import { getAuth } from "firebase/auth";

// ✅ Skeleton imports
import UserHomeSkeleton from "../Skeletons/UserHomeSkeleton";
import MembershipSkeleton from "../Skeletons/MembershipSkeleton";
import MyPostsSkeleton from "../skeletons/MyPostsSkeelton";
import DashboardProfileSkeleton from "../Skeletons/DashboardProfileSkeleton";
import PostCommentsSkeleton from "../Skeletons/PostCommentsSkeleton";

export default function UserRoute({ children }) {
    const [role, loading] = useUserRole();
    const [allowNavigation, setAllowNavigation] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const location = useLocation();

    // ✅ Choose skeleton based on route
    const getSkeleton = () => {
        if (location.pathname.includes("/membership")) return <MembershipSkeleton />;
        if (location.pathname.includes("/dashboard/userhome")) return <UserHomeSkeleton />;
        if (location.pathname.includes("/dashboard/profile")) return <DashboardProfileSkeleton />;
        if (location.pathname.includes("/dashboard/myposts")) return <MyPostsSkeleton />;
        if (location.pathname.includes("/dashboard/posts/")) return <PostCommentsSkeleton />;
    };

    // ✅ Delay before navigating to forbidden
    useEffect(() => {
        if (!loading && role !== "user" && user) {
            const timer = setTimeout(() => {
                setAllowNavigation(true);
            }, 1000); // 1 second delay
            return () => clearTimeout(timer);
        }
    }, [loading, role, user]);

    // ✅ Handle loading state
    if (loading) return getSkeleton();

    // ✅ Auth check
    if (!user) return <Navigate to="/login" replace />;
    console.log(role);
    if (role !== "user" && allowNavigation) return <Navigate to="/forbidden" replace />;

    return children;
}
