// src/Components/useAxiosSecure.js
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // you can add defaults here (timeout, headers, etc.)
});

export default function useAxiosSecure() {
    useEffect(() => {
        // Helper: wait for a Firebase user to become available (or timeout).
        const waitForAuthUser = (timeoutMs = 5000) =>
            new Promise((resolve) => {
                try {
                    const auth = getAuth();
                    const current = auth.currentUser;
                    if (current) return resolve(current);

                    // Listen once for auth state change
                    const unsubscribe = onAuthStateChanged(auth, (u) => {
                        unsubscribe();
                        resolve(u || null);
                    });

                    // Safety timeout: stop listening and resolve null
                    const to = setTimeout(() => {
                        try { unsubscribe(); } catch (e) { }
                        resolve(null);
                    }, timeoutMs);

                    // clear timeout if listener resolved earlier (handled by unsubscribe above)
                } catch (err) {
                    // If something goes wrong, resolve null
                    resolve(null);
                }
            });

        const interceptorId = axiosSecure.interceptors.request.use(
            async (config) => {
                try {
                    const user = await waitForAuthUser(5000); // wait up to 5s
                    if (user) {
                        // attach token
                        const token = await user.getIdToken(); // you can use true to force refresh if needed
                        config.headers = config.headers || {};
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (err) {
                    // don't block request on token error; simply continue without token
                    // console.warn("useAxiosSecure: token attach failed", err);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            // eject on unmount to avoid adding many interceptors
            axiosSecure.interceptors.request.eject(interceptorId);
        };
    }, []);

    return axiosSecure;
}


