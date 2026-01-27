// AppRouter.tsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useUserStore } from "./store/userStore";

import Index from "./pages/Index";
import FileComplaint from "./pages/FileComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AllReports from "./pages/AllComplaints";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";

// Protected Route Component - Only for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useUserStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
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
        <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
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
                        path="/complaint"
                        element={
                            <ProtectedRoute>
                                <FileComplaint />
                            </ProtectedRoute>
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
                            <ProtectedRoute>
                                <AllReports />
                            </ProtectedRoute>
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
