import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TooltipProvider } from "./components/ui/tooltip"
import { Toaster as Sonner } from "./components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner"
import Index from "./pages/Index"
import FileComplaint from "./pages/FileComplaint"
import TrackComplaint from "./pages/TrackComplaint"
import AllReports from "./pages/AllReports"
import { Header } from "./components/header";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/complaint" element={<FileComplaint />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/reports-feed" element={<AllReports />} />
              ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App