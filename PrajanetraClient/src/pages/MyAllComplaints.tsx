import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useComplaintStore } from "@/store/complaintStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, FileText, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplaintListCard } from "@/components/profilecomponents/ComplaintListCard";

const MyAllComplaints = () => {
    const { user, isAuthenticated } = useUserStore();
    const { userComplaints, getUserComplaints, isLoading, userPagination } = useComplaintStore();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        navigate("/login");
        return null;
    }

    // Fetch user complaints on mount and page change
    useEffect(() => {
        if (user?.userId) {
            getUserComplaints(user.userId, { page: currentPage, size: 10 });
        }
    }, [user?.userId, currentPage, getUserComplaints]);

    // Handle refresh complaints
    const handleRefresh = async () => {
        if (user?.userId) {
            try {
                await getUserComplaints(user.userId, { page: currentPage, size: 10 });
                toast.success("Complaints refreshed successfully");
            } catch (error) {
                toast.error("Failed to refresh complaints");
            }
        }
    };

    const handleNextPage = () => {
        if (currentPage < userPagination.totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleGoToPage = (page: number) => {
        if (page >= 0 && page < userPagination.totalPages) {
            setCurrentPage(page);
        }
    };

    // Show loader while initial data is loading
    if (isLoading && userComplaints.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-b from-background/80 via-background/70 to-background/60 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading your complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-background/80 via-background/70 to-background/60">
            <div className="px-6 sm:px-10 md:px-16 lg:px-32 xl:px-48 pt-16 pb-12">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/profile")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                    </Button>
                </div>

                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-2xl">All Your Complaints</CardTitle>
                                <CardDescription>
                                    Viewing all {userPagination.totalItems} complaints you've submitted
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Button
                                    onClick={() => navigate("/complaint")}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    New Complaint
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {userComplaints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No complaints found</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    You haven't submitted any complaints yet.
                                </p>
                                <Button onClick={() => navigate("/complaint")} className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    File Your First Complaint
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Complaints List */}
                                <div className="space-y-3">
                                    {userComplaints.map((complaint) => (
                                        <ComplaintListCard
                                            key={complaint.complaintId}
                                            complaint={complaint}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {userPagination.totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Page {currentPage + 1} of {userPagination.totalPages}
                                            {" • "}
                                            Showing {userComplaints.length} of {userPagination.totalItems} complaints
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 0 || isLoading}
                                            >
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, userPagination.totalPages) }, (_, i) => {
                                                    let pageNum: number;

                                                    if (userPagination.totalPages <= 5) {
                                                        pageNum = i;
                                                    } else if (currentPage < 3) {
                                                        pageNum = i;
                                                    } else if (currentPage >= userPagination.totalPages - 3) {
                                                        pageNum = userPagination.totalPages - 5 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handleGoToPage(pageNum)}
                                                            disabled={isLoading}
                                                            className="w-10"
                                                        >
                                                            {pageNum + 1}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleNextPage}
                                                disabled={currentPage >= userPagination.totalPages - 1 || isLoading}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Loading Overlay */}
                        {isLoading && userComplaints.length > 0 && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MyAllComplaints;
