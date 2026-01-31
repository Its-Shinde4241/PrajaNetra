import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, CheckCircle2 } from "lucide-react";
import { ComplaintListCard } from "./ComplaintListCard";
import { ComplaintStatus } from "@/store/complaintStore";

interface ComplaintsSectionProps {
    userComplaints: Array<{
        complaintId: string;
        title: string;
        description: string;
        likes: number;
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
            {/* Complaints List */}
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle>Your Complaints</CardTitle>
                            <CardDescription>View and track all your submitted complaints</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Stats badges */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary">
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="text-sm sm:text-base font-semibold">{totalComplaints}</span>
                                    <span className="text-xs sm:text-sm hidden sm:inline">Total</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-500">
                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="text-sm sm:text-base font-semibold">{resolvedComplaintsCount}</span>
                                    <span className="text-xs sm:text-sm hidden sm:inline">Resolved</span>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={onRefresh}
                                    disabled={isLoading}
                                    className="h-9 w-9 sm:h-10 sm:w-10"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button onClick={onNewComplaint} className="text-sm sm:text-base">
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                    <span className="hidden sm:inline">New Complaint</span>
                                    <span className="sm:hidden">New</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {userComplaints && userComplaints.length > 0 ? (
                            userComplaints.map((complaint) => (
                                <ComplaintListCard key={complaint.complaintId} complaint={complaint} />
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
