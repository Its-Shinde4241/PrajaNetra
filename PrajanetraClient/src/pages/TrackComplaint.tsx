import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useComplaintStore } from "@/store/complaintStore";
import { toast } from "sonner";
import { ComplaintCard } from "@/components/ComplaintCard";

const TrackComplaint = () => {
  const location = useLocation();
  const initialId = location.state?.complaintId || "";

  const [complaintId, setComplaintId] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);

  const { currentComplaint, isLoading, error, getComplaint, clearError, clearCurrentComplaint } = useComplaintStore();

  useEffect(() => {
    // If there's an initial ID from navigation, fetch it
    if (initialId) {
      handleSearch(null, initialId);
    }

    // Cleanup on unmount
    return () => {
      clearCurrentComplaint();
      clearError();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent | null, idToSearch?: string) => {
    if (e) e.preventDefault();

    const id = idToSearch || complaintId;
    if (!id.trim()) {
      toast.error("Please enter a complaint ID");
      return;
    }

    try {
      await getComplaint(id);
      setSearchedId(id);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch complaint");
    }
  };

  // Helper function to generate timeline from status
  const generateTimeline = (currentStatus: string) => {
    const statuses = [
      { status: "SUBMITTED", label: "Submitted" },
      { status: "ACKNOWLEDGED", label: "Acknowledged" },
      { status: "UNDER_REVIEW", label: "Under Review" },
      { status: "IN_PROGRESS", label: "In Progress" },
      { status: "RESOLVED", label: "Resolved" },
    ];

    const currentIndex = statuses.findIndex(s => s.status === currentStatus);

    return statuses.map((item, index) => ({
      status: item.label,
      date: index <= currentIndex ? "Completed" : "Pending",
      completed: index <= currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background/80 via-background/70 to-background/60">
      {/* Static blur gradient background overlay */}
      <div className="absolute inset-0 " />

      {/* Content */}
      <motion.div
        className="relative z-10 pt-24 pb-12 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container mx-auto max-w-4xl">
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
            className="space-y-6 min-h-[600px]"
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
                    data={{ complaint: currentComplaint }}
                    appearance={{
                      variant: "default",
                      showImages: true,
                      showStatus: true,
                      showCategory: true,
                      showLikes: true
                    }}
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
                  <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
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
                      <div className="space-y-4">
                        {(() => {
                          const timeline = generateTimeline(currentComplaint.status);
                          const lastCompletedIndex = timeline.map((t, i) => t.completed ? i : -1).filter(i => i !== -1).pop() ?? -1;

                          return timeline.map((item, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start space-x-4"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -10, opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                ease: "easeOut",
                                delay: 2.0 + index * 0.1
                              }}
                            >
                              <div className="relative">
                                <motion.div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                    }`}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                    delay: 2.1 + index * 0.1
                                  }}
                                >
                                  {item.completed ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                </motion.div>
                                {index < timeline.length - 1 && (
                                  <motion.div
                                    className={`absolute left-4 top-8 w-0.5 h-8 ${item.completed ? "bg-primary" : "bg-muted"
                                      }`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 32, opacity: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeOut",
                                      delay: 2.2 + index * 0.1
                                    }}
                                  />
                                )}
                              </div>
                              <motion.div
                                className="flex-1 pt-1"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeOut",
                                  delay: 2.2 + index * 0.1
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <p
                                    className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"
                                      }`}
                                  >
                                    {item.status}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{item.date}</p>
                                </div>
                                {item.completed && index === lastCompletedIndex && (
                                  <motion.p
                                    className="text-sm text-primary flex items-center mt-1"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeOut",
                                      delay: 2.3 + index * 0.1
                                    }}
                                  >
                                    Current Stage <ArrowRight className="w-3 h-3 ml-1" />
                                  </motion.p>
                                )}
                              </motion.div>
                            </motion.div>
                          ));
                        })()}
                      </div>
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