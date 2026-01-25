import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { axiosInstance } from "@/lib/axios";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);
    const logout = useUserStore((state) => state.logout);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                console.error("No token found in OAuth callback");
                logout();
                // navigate("/login");
                return;
            }

            try {
                // 1️⃣ Persist token in Zustand-compatible way
                setUser(null as any, token);
                // ^ temporary user, token is what matters now

                // 2️⃣ Ask backend who the user is (single source of truth)
                const res = await axiosInstance.get("/auth/me");
                console.log("OAuth /auth/me response:", res);
                // backend returns: { authenticated: true, user: {...} }
                if (!res.data?.authenticated) {
                    throw new Error("Unauthenticated");
                }

                // 3️⃣ Store REAL user
                console.log("OAuth login successful:", res.data.user);
                setUser(res.data.user, token);

                // 4️⃣ Redirect
                navigate("/");
            } catch (err) {
                logout();
                navigate("/login");
            }
        };

        handleOAuthCallback();
    }, [navigate, setUser, logout]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}
