import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Components/AuthContext.js"; // adjust path if needed
import LoadingSpinner from "../Components/LoadingSpinner"; // optional loader

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    console.log(user);

    if (loading) {
        return <LoadingSpinner />; // while checking auth state
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default PrivateRoute;
