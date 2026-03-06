import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useUserStore } from "./store/userStore";

import Index from "./pages/Index";
import FileComplaint from "./pages/FileComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MyAllComplaints from "./pages/MyAllComplaints";
import OAuthCallback from "./pages/OAuthCallback";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintsManagement from "./pages/ComplaintsManagement";
import UserManagement from "./pages/UserManagement";
import { useEffect } from "react";
import Feed from "./pages/FeedPage";

// Protected Route Component - Only for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, validateToken } = useUserStore();

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

// Admin Only Route Component - Only for authenticated admin/staff users
function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, validateToken } = useUserStore();

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    console.log("User Roles:", user?.roles);
    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("MUNICIPAL_STAFF");

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

// Public Only Route Component - Only for non-authenticated users
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useUserStore();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}


export function AppRouter() {
    const location = useLocation();

    return (
        <div className="relative overflow-hidden min-h-screen backdrop-blur-sm bg-linear-to-b from-background/70 via-background/60 to-background/50 ">
            <AnimatePresence mode="wait">
                {/* key MUST change when route changes */}
                <Routes location={location} key={location.pathname}>
                    {/* Public Only Routes - Redirect to home if already logged in */}
                    <Route
                        path="/signup"
                        element={
                            <PublicOnlyRoute>
                                <Signup />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute>
                                <Login />
                            </PublicOnlyRoute>
                        }
                    />

                    {/* OAuth Callback - No auth required, handles its own flow */}
                    <Route path="/oauth-success" element={<OAuthCallback />} />

                    {/* Protected Routes - Require authentication */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-complaints"
                        element={
                            <ProtectedRoute>
                                <MyAllComplaints />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/complaint"
                        element={
                            <ProtectedRoute>
                                <FileComplaint />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Only Routes - Require admin/staff role */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/complaints"
                        element={
                            <AdminRoute>
                                <ComplaintsManagement />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <UserManagement />
                            </AdminRoute>
                        }
                    />

                    {/* Public Routes - Accessible to everyone */}
                    <Route
                        path="/"
                        element={
                            <Index />
                        }
                    />
                    <Route
                        path="/track"
                        element={
                            <ProtectedRoute>
                                <TrackComplaint />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports-feed"
                        element={
                            <Feed />
                        }
                    />

                    {/* If you add a NotFound route later, also wrap it */}
                    {/* 
                    <Route
                        path="*"
                        element={
                            <NotFound />
                        }
                    /> */}
                </Routes>
            </AnimatePresence>
        </div>
    );
}
