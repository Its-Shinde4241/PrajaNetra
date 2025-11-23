import { useState } from "react";
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
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Track Your Complaint
            </h1>
            <p className="text-muted-foreground">
              Enter your complaint ID to check the current status
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8 animate-scale-in border-border shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="complaint-id" className="sr-only">
                    Complaint ID
                  </Label>
                  <Input
                    id="complaint-id"
                    placeholder="Enter your complaint ID (e.g., MCP12345678)"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSearching}
                  className="hover-scale"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {searchedId && (
            <div className="space-y-6 animate-fade-in">
              {/* Status Overview */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {getStatusIcon(complaintData.status)}
                      <span>Complaint #{complaintData.id}</span>
                    </CardTitle>
                    <Badge className={`${getStatusColor(complaintData.status)} text-white`}>
                      {complaintData.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Submitted on {complaintData.submittedDate} • Last updated{" "}
                    {complaintData.lastUpdated}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Category
                      </p>
                      <p className="text-foreground">{complaintData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Location
                      </p>
                      <p className="text-foreground">{complaintData.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-foreground">{complaintData.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle>Resolution Timeline</CardTitle>
                  <CardDescription>
                    Track the progress of your complaint resolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">

                    {complaintData.timeline.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {index < complaintData.timeline.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 w-0.5 h-8 ${item.completed ? "bg-primary" : "bg-muted"
                                }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
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
                            <p className="text-sm text-primary flex items-center mt-1">
                              Current Stage <ArrowRight className="w-3 h-3 ml-1" />
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;
