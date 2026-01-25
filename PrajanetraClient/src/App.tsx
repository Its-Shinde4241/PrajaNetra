// App.tsx
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Header } from "./components/header";
import { AppRouter } from "./AppRouter";
import heroImage from "@/assets/hero-city.jpg";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="vite-ui-theme"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            {/* Fixed Background Image - Outside all animations */}
            <div
              className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${heroImage})`,
                willChange: 'auto', // Optimize for performance
                transform: 'translateZ(0)', // Force GPU acceleration
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content wrapper with higher z-index */}
            <div className="relative z-10">
              {/* Header is outside routes so it doesn't re-animate on every page */}
              <Header />
              <AppRouter />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;