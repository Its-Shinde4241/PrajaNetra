// AppRouter.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Index from "./pages/Index";
import FileComplaint from "./pages/FileComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AllReports from "./pages/AllReports";


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

                            <Index />

                        }
                    />
                    <Route
                        path="/complaint"
                        element={

                            <FileComplaint />

                        }
                    />
                    <Route
                        path="/track"
                        element={

                            <TrackComplaint />

                        }
                    />
                    <Route
                        path="/reports-feed"
                        element={

                            <AllReports />

                        }
                    />

                    {/* If you add a NotFound route later, also wrap it */}
                    {/* 
            <Route
              path="*"
              element={
                
                  <NotFound />
                
              }
            />
            */}
                </Routes>
            </AnimatePresence>
        </div>
    );
}
