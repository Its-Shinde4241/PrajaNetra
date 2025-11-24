import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const TrackComplaint = () => {
  const location = useLocation();
  const initialId = location.state?.complaintId || "";

  const [complaintId, setComplaintId] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data - in real app, this would come from API
  const complaintData = {
    id: searchedId || "MCP12345678",
    status: "In Progress",
    category: "Road & Infrastructure",
    location: "Main Street, Sector 5",
    description: "Pothole causing traffic issues",
    submittedDate: "2025-11-20",
    lastUpdated: "2025-11-22",
    timeline: [
      { status: "Submitted", date: "2025-11-20", completed: true },
      { status: "Acknowledged", date: "2025-11-20", completed: true },
      { status: "Under Review", date: "2025-11-21", completed: true },
      { status: "In Progress", date: "2025-11-22", completed: true },
      { status: "Resolved", date: "Pending", completed: false },
    ],
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSearchedId(complaintId);
    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Static blur gradient background overlay - NO ANIMATIONS */}
      <div className="absolute inset-0 bg-linear-to-br from-background/90 via-background/85 to-background/80 " />

      {/* Content - WITH ANIMATIONS */}
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
                          // size="sm"
                          disabled={isSearching}
                          className="relative overflow-hidden"
                        >
                          <motion.span
                            animate={isSearching ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Search className="w-4 h-4 mr-2" />
                            {/* {isSearching ? "Searching..." : "Search"} */}
                          </motion.span>
                          {isSearching && (
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
          {searchedId && (
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
              {/* Status Overview */}
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
                <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 1.1
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 0.3, delay: 1.2 }}
                          >
                            {getStatusIcon(complaintData.status)}
                          </motion.div>
                          <span>Complaint #{complaintData.id}</span>
                        </CardTitle>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1.3 }}
                        >
                          <Badge className={`${getStatusColor(complaintData.status)} text-white`}>
                            {complaintData.status}
                          </Badge>
                        </motion.div>
                      </div>
                      <CardDescription>
                        Submitted on {complaintData.submittedDate} • Last updated{" "}
                        {complaintData.lastUpdated}
                      </CardDescription>
                    </CardHeader>
                  </motion.div>

                  <CardContent className="space-y-4">
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.4
                      }}
                    >
                      <motion.div
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 1.5
                        }}
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Category
                        </p>
                        <p className="text-foreground">{complaintData.category}</p>
                      </motion.div>
                      <motion.div
                        initial={{ x: 15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 1.6
                        }}
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </p>
                        <p className="text-foreground">{complaintData.location}</p>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: 1.7
                      }}
                    >
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-foreground">{complaintData.description}</p>
                    </motion.div>
                  </CardContent>
                </Card>
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
                      {complaintData.timeline.map((item, index) => (
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
                            {index < complaintData.timeline.length - 1 && (
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
                            {item.completed && index === complaintData.timeline.findIndex(t => t.completed) && (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TrackComplaint;