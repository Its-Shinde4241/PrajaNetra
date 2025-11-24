// AppRouter.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Index from "./pages/Index";
import FileComplaint from "./pages/FileComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AllReports from "./pages/AllReports";
import { PageLayout } from "./components/Pagelayout";

export function AppRouter() {
    const location = useLocation();

    return (
        <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
            <AnimatePresence mode="wait">
                {/* key MUST change when route changes */}
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <PageLayout>
                                <Index />
                            </PageLayout>
                        }
                    />
                    <Route
                        path="/complaint"
                        element={
                            <PageLayout>
                                <FileComplaint />
                            </PageLayout>
                        }
                    />
                    <Route
                        path="/track"
                        element={
                            <PageLayout>
                                <TrackComplaint />
                            </PageLayout>
                        }
                    />
                    <Route
                        path="/reports-feed"
                        element={
                            <PageLayout>
                                <AllReports />
                            </PageLayout>
                        }
                    />

                    {/* If you add a NotFound route later, also wrap it */}
                    {/* 
            <Route
              path="*"
              element={
                <PageLayout>
                  <NotFound />
                </PageLayout>
              }
            />
            */}
                </Routes>
            </AnimatePresence>
        </div>
    );
}
