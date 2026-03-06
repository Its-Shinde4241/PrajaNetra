import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw } from "lucide-react";
import { useFeedStore } from "@/store/FeedStore";
import { ComplaintListCard } from "./ComplaintListCard";
import { useEffect } from "react";

interface LikedComplaintsSectionProps {
    onViewAll?: () => void;
}

export const LikedComplaintsSection = ({ onViewAll }: LikedComplaintsSectionProps) => {
    const {
        likedComplaints,
        fetchLikedComplaints,
        isLoading,
        error,
    } = useFeedStore();

    useEffect(() => {
        fetchLikedComplaints(0);
    }, [fetchLikedComplaints]);

    const handleRefresh = () => fetchLikedComplaints(0);

    return (
        <div className="space-y-6">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle>Liked Complaints</CardTitle>
                            <CardDescription>Complaints you've liked</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="h-9 w-9 sm:h-10 sm:w-10"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {error && (
                            <div className="text-center text-destructive mb-4">{error}</div>
                        )}
                        {likedComplaints && likedComplaints.length > 0 ? (
                            likedComplaints.map((complaint) => (
                                <ComplaintListCard key={complaint.complaintId} complaint={complaint} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                <h3 className="text-lg font-semibold mb-2">No liked complaints yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't liked any complaints yet.
                                </p>
                            </div>
                        )}
                    </div>
                    {likedComplaints && likedComplaints.length > 0 && onViewAll && (
                        <div className="mt-6 text-center">
                            <Button variant="outline" onClick={onViewAll}>
                                View All Liked Complaints
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};