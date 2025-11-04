// Updated AuthProvider.js - Add role management
import React, { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase.config.init";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure"; // Make sure this import path is correct

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // Add role state
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();
    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .finally(() => setLoading(false));
    };

    const googleLogin = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Normalize user
        const normalizedUser = {
            ...firebaseUser,
            email: firebaseUser.email?.toLowerCase(),
        };

        // Fetch JWT from backend
        try {
            const res = await axiosSecure.post("/jwt", { email: normalizedUser.email });
            const token = res.data.token;
            localStorage.setItem("access-token", token); // store JWT
            console.log("JWT stored:", token);
        } catch (err) {
            console.error("Failed to fetch JWT:", err);
        }

        // Set user AFTER JWT is stored
        setUser(normalizedUser);

        return result;
    };


    const updateUserProfile = (name, photoURL) => {
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, { displayName: name, photoURL });
        }
        return Promise.reject(new Error("No user is logged in"));
    };

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);

        // Fetch JWT from backend
        try {
            const res = await axiosSecure.post("/jwt", { email: result.user.email });
            const token = res.data.token;
            localStorage.setItem("access-token", token); // store JWT in localStorage
            console.log("JWT stored:", token);
        } catch (err) {
            console.error("Failed to fetch JWT:", err);
        }

        return result;
    };

    const logOut = () => {
        setUser(null);
        setRole(null); // Clear role on logout
        return signOut(auth);
    };


    // const fetchUserRole = async (userEmail) => {
    //     if (!userEmail) {
    //         console.log("No email provided for role fetch");
    //         setRole(null);
    //         return;
    //     }

    //     try {
    //         console.log("Fetching role for:", userEmail);
    //         const response = await axiosSecure.get(`/users/role/${userEmail}`);
    //         console.log("Role response:", response.data);

    //         if (response.data && response.data.role) {
    //             setRole(response.data.role);
    //             console.log("Role set to:", response.data.role);
    //         } else {
    //             console.log("No role found in response");
    //             setRole(null);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching user role:", error);
    //         console.error("Error details:", error.response?.data);
    //         setRole(null);
    //     }
    // };


    const fetchUserRole = async (userEmail) => {
        if (!userEmail) return setRole(null);

        const token = localStorage.getItem("access-token");
        if (!token) {
            console.log("JWT not ready, cannot fetch role");
            return setRole(null);
        }

        try {
            const response = await axiosSecure.get(`/users/role/${userEmail}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.role) {
                setRole(response.data.role);
            } else {
                setRole(null);
            }
        } catch (err) {
            console.error("Error fetching role:", err.response?.data || err.message);
            setRole(null);
        }
    };


    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    //         console.log("Auth state changed:", currentUser?.email);

    //         if (currentUser) {
    //             const normalizedUser = {
    //                 ...currentUser,
    //                 email: currentUser.email?.toLowerCase()
    //             };
    //             setUser(normalizedUser);

    //             // Fetch role after user is set
    //             await fetchUserRole(normalizedUser.email);
    //         } else {
    //             setUser(null);
    //             setRole(null);
    //         }

    //         setLoading(false);
    //     });

    //     return () => unsubscribe();
    // }, [axiosSecure]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true); // ✅ start loading when auth state changes
            if (currentUser?.email) {
                const normalizedUser = {
                    ...currentUser,
                    email: currentUser.email.toLowerCase(),
                };
                setUser(normalizedUser);

                // wait until role is fetched
                await fetchUserRole(normalizedUser.email);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false); // ✅ only stop loading after role is ready
        });

        return () => unsubscribe();
    }, [auth, axiosSecure]);


    const authInfo = {
        user,
        role,        // Add role to context
        loading,
        createUser,
        updateUserProfile,
        googleLogin,
        login,
        logOut,
        fetchUserRole, // Optional: allow manual role refresh
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

