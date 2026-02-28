import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useComplaintStore } from "@/store/complaintStore";
import { toast } from "sonner";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Timeline, generateTimelineSteps } from "@/components/Timeline";

const TrackComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id") || "";

  const [complaintId, setComplaintId] = useState(idFromUrl);
  const [searchedId, setSearchedId] = useState("");

  const { currentComplaint, isLoading, error, getComplaint, clearError, clearCurrentComplaint } = useComplaintStore();

  // Fetch complaint when URL param changes (direct link or navigation)
  useEffect(() => {
    if (idFromUrl) {
      setComplaintId(idFromUrl);
      fetchComplaint(idFromUrl);
    }
  }, [idFromUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentComplaint();
      clearError();
    };
  }, []);

  const fetchComplaint = async (id: string) => {
    if (!id.trim()) {
      toast.error("Please enter a complaint ID");
      return;
    }

    try {
      clearError();
      await getComplaint(id.trim());
      setSearchedId(id.trim());
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch complaint");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      toast.error("Please enter a complaint ID");
      return;
    }

    // Update the URL search param so the link is shareable
    setSearchParams({ id: complaintId.trim() });
    await fetchComplaint(complaintId.trim());
  };

  return (
    <div className="min-h-screen ">
      {/* Static blur gradient background overlay */}
      <div className="absolute inset-0 " />

      {/* Content */}
      <motion.div
        className="relative z-10 pt-24 pb-12 px-4 backdrop-blur-sm min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -10, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.2
              }}
            >
              Track Your Complaint
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3
              }}
            >
              Enter your complaint ID to check the current status
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -25, opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4
            }}
          >
            <Card className="mb-8 border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.6
                }}
              >
                <CardContent className="pt-6">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <motion.div
                      className="flex-1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.7
                      }}
                    >
                      <Label htmlFor="complaint-id" className="sr-only">
                        Complaint ID
                      </Label>
                      <Input
                        id="complaint-id"
                        placeholder="Enter your complaint ID (e.g., MCP12345678)"
                        value={complaintId}
                        onChange={(e) => setComplaintId(e.target.value)}
                        required
                        className="transition-all duration-300 focus:scale-102 hover:shadow-md"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 10, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.8
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="relative overflow-hidden"
                        >
                          <motion.span
                            animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                          </motion.span>
                          {isLoading && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.9
            }}
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive"
              >
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* No Results */}
            {searchedId && !currentComplaint && !isLoading && !error && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center p-8"
              >
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No complaint found</p>
                <p className="text-muted-foreground">Please check the complaint ID and try again</p>
              </motion.div>
            )}

            {searchedId && currentComplaint && (
              <>
                {/* Complaint Card */}
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -15, opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 1.0
                  }}
                >
                  <ComplaintCard
                    complaint={currentComplaint}
                  />
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 1.8
                  }}
                >
                  <Card className="w-full max-w-[470px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[630px] mx-auto border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.9
                      }}
                    >
                      <CardHeader>
                        <CardTitle>Resolution Timeline</CardTitle>
                        <CardDescription>
                          Track the progress of your complaint resolution
                        </CardDescription>
                      </CardHeader>
                    </motion.div>

                    <CardContent>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 2.0
                        }}
                      >
                        <Timeline steps={generateTimelineSteps(currentComplaint.status)} />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrackComplaint;