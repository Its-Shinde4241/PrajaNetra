import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, CheckCircle2 } from "lucide-react";
import { ComplaintCard } from "./ComplaintCard";
import { ComplaintStatus } from "@/store/complaintStore";

interface ComplaintsSectionProps {
    userComplaints: Array<{
        complaintId: string;
        title: string;
        description: string;
        status: string;
        category: string;
        createdAt: string;
        imageUrls?: string[];
    }>;
    isLoading: boolean;
    onRefresh: () => void;
    onNewComplaint: () => void;
    onViewAll: () => void;
}

export const ComplaintsSection = ({
    userComplaints,
    isLoading,
    onRefresh,
    onNewComplaint,
    onViewAll,
}: ComplaintsSectionProps) => {
    const totalComplaints = userComplaints.length;
    const resolvedComplaintsCount = userComplaints.filter(
        complaint => complaint.status === ComplaintStatus.RESOLVED
    ).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">{totalComplaints}</div>
                            <div className="text-sm text-muted-foreground">Total Complaints</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                            <div className="text-2xl font-bold">
                                {resolvedComplaintsCount}
                            </div>
                            <div className="text-sm text-muted-foreground">Resolved</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Complaints List */}
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Your Complaints</CardTitle>
                            <CardDescription>View and track all your submitted complaints</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button onClick={onNewComplaint}>
                                <FileText className="w-4 h-4 mr-2" />
                                New Complaint
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {userComplaints && userComplaints.length > 0 ? (
                            userComplaints.map((complaint) => (
                                <ComplaintCard key={complaint.complaintId} complaint={complaint} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                <h3 className="text-lg font-semibold mb-2">No complaints yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't submitted any complaints yet.
                                </p>
                                <Button onClick={onNewComplaint}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    File Your First Complaint
                                </Button>
                            </div>
                        )}
                    </div>

                    {userComplaints && userComplaints.length > 0 && (
                        <div className="mt-6 text-center">
                            <Button variant="outline" onClick={onViewAll}>
                                View All Complaints
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
