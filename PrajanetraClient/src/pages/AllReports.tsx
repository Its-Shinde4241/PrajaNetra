import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/animate-ui/components/radix/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Clock, CheckCircle2, Send, MapPin } from "lucide-react";

interface Report {
  id: string;
  category: string;
  location: string;
  description: string;
  image: string;
  timestamp: string;
  status: string;
  anonymousUser: string;
  comments: Comment[];
  timeline: TimelineStep[];
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
}

const AllReports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Mock data - in real app, this would come from API
  const mockReports: Report[] = [
    {
      id: "MCP12345678",
      category: "Road & Infrastructure",
      location: "Main Street, Sector 5",
      description: "Large pothole causing traffic issues and safety hazards",
      image: "https://images.unsplash.com/photo-1625726411847-8cbb60cc71e6?w=800&auto=format&fit=crop",
      timestamp: "2 hours ago",
      status: "In Progress",
      anonymousUser: "Citizen #A7B2",
      comments: [
        { id: "1", user: "Citizen #C4D9", text: "I've seen this too, very dangerous!", timestamp: "1 hour ago" },
        { id: "2", user: "Admin", text: "Work crew has been dispatched. Expected completion in 3 days.", timestamp: "30 mins ago" }
      ],
      timeline: [
        { status: "Submitted", date: "2025-11-20", completed: true },
        { status: "Acknowledged", date: "2025-11-20", completed: true },
        { status: "Under Review", date: "2025-11-21", completed: true },
        { status: "In Progress", date: "2025-11-22", completed: true },
        { status: "Resolved", date: "Pending", completed: false },
      ]
    },
    {
      id: "MCP12345679",
      category: "Waste Management",
      location: "Park Avenue, Sector 2",
      description: "Overflowing garbage bins not collected for 3 days",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop",
      timestamp: "5 hours ago",
      status: "Acknowledged",
      anonymousUser: "Citizen #X9K1",
      comments: [],
      timeline: [
        { status: "Submitted", date: "2025-11-22", completed: true },
        { status: "Acknowledged", date: "2025-11-22", completed: true },
        { status: "Under Review", date: "Pending", completed: false },
        { status: "In Progress", date: "Pending", completed: false },
        { status: "Resolved", date: "Pending", completed: false },
      ]
    },
    {
      id: "MCP12345680",
      category: "Street Lighting",
      location: "Industrial Area, Zone 3",
      description: "Multiple street lights not working, area unsafe at night",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop",
      timestamp: "1 day ago",
      status: "Resolved",
      anonymousUser: "Citizen #M3P7",
      comments: [
        { id: "1", user: "Citizen #L8N2", text: "Thank you for reporting this!", timestamp: "20 hours ago" },
        { id: "2", user: "Admin", text: "All lights have been repaired and tested.", timestamp: "2 hours ago" }
      ],
      timeline: [
        { status: "Submitted", date: "2025-11-21", completed: true },
        { status: "Acknowledged", date: "2025-11-21", completed: true },
        { status: "Under Review", date: "2025-11-21", completed: true },
        { status: "In Progress", date: "2025-11-22", completed: true },
        { status: "Resolved", date: "2025-11-23", completed: true },
      ]
    }
  ];

  const [reports] = useState<Report[]>(mockReports);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Acknowledged":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  const handleAddComment = (reportId: string) => {
    if (!commentText.trim()) return;
    // In real app, this would be an API call
    console.log("Adding comment to report:", reportId, commentText);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Community Reports
            </h1>
            <p className="text-muted-foreground">
              View and track all citizen complaints in real-time
            </p>
          </div>

          {/* Reports Feed */}
          <div className="space-y-6">
            {reports.map((report, index) => (
              <Card
                key={report.id}
                className="border-border shadow-lg animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {report.anonymousUser.split('#')[1].slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{report.anonymousUser}</p>
                        <p className="text-sm text-muted-foreground">{report.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(report.status)} text-white`}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={report.image}
                    alt="Report incident"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <CardContent className="pt-4">
                  {/* Actions */}
                  <div className="flex items-center space-x-4 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                      className="text-foreground hover:text-primary"
                    >
                      <MessageCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">{report.comments.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowTimeline(true);
                      }}
                      className="text-foreground hover:text-primary"
                    >
                      <Clock className="w-5 h-5 mr-1" />
                      <span className="text-sm">Timeline</span>
                    </Button>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-2">{report.category}</Badge>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{report.location}</span>
                    </div>
                    <p className="text-foreground">
                      <span className="font-semibold">{report.anonymousUser}:</span>{" "}
                      {report.description}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {report.id}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={selectedReport !== null && !showTimeline} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent
          from="bottom"
          showCloseButton={true}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {selectedReport?.comments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-muted">
                        {comment.user.split('#')[1]?.slice(0, 2) || comment.user.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm text-foreground">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground pl-8">{comment.text}</p>
                </div>
              ))}
              {selectedReport?.comments.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <div className="flex space-x-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && selectedReport) {
                  handleAddComment(selectedReport.id);
                }
              }}
            />
            <Button
              size="icon"
              onClick={() => selectedReport && handleAddComment(selectedReport.id)}
              disabled={!commentText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeline Dialog */}
      <Dialog open={showTimeline && selectedReport !== null} onOpenChange={() => setShowTimeline(false)}>
        <DialogContent
          from="right"
          showCloseButton={true}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Resolution Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedReport?.timeline.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4"
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
                  {index < (selectedReport?.timeline.length || 0) - 1 && (
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
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllReports;
