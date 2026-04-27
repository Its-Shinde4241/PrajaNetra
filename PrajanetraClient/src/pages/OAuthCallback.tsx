import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { axiosInstance } from "@/lib/axios";
import ActivityIcon from "@/components/activity-icon";

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
                setUser(null as any, token);

                const res = await axiosInstance.get("/auth/me");
                // console.log("OAuth /auth/me response:", res);
                // backend returns: { authenticated: true, user: {...} }
                if (!res.data?.authenticated) {
                    throw new Error("Unauthenticated");
                }

                // console.log("OAuth login successful:", res.data.user);
                setUser(res.data.user, token);
                navigate("/");
            } catch (err) {
                logout();
                navigate("/login");
            }
        };

        handleOAuthCallback();
    }, [navigate, setUser, logout]);

    return (
        <div className="flex items-center justify-center min-h-screen inset-0 bg-linear-to-br from-background/80 via-background/70 to-background/60">
            <div className="text-center">
                <ActivityIcon
                    className="text-black dark:text-white"
                    size={40}
                    duration={2}
                    strokeWidth={2}
                    ease="easeInOut"
                />
            </div>
        </div>
    );
}
