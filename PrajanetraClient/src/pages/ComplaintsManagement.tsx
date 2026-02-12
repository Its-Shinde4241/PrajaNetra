import { useEffect, useState } from "react";
import { useAdminStore, ComplaintStatus } from "@/store/adminStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Search, RefreshCw, Clock, Users, FileText } from "lucide-react";
import { SmoothLoader } from "@/components/ui/smooth-loader";

const ComplaintsManagement = () => {
    const {
        recentComplaints,
        complaints,
        isLoading,
        error,
        getRecentComplaints,
        getComplaintsByStatus,
        changeComplaintStatus,
        clearError,
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "ALL">("ALL");
    const [filteredComplaints, setFilteredComplaints] = useState(recentComplaints);

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error]);

    useEffect(() => {
        filterComplaints();
    }, [searchTerm, statusFilter, recentComplaints, complaints]);

    const loadComplaints = async () => {
        try {
            await getRecentComplaints(50);
        } catch (err) {
            toast.error("Failed to load complaints");
        }
    };

    const filterComplaints = () => {
        let filtered = statusFilter === "ALL" ? recentComplaints : complaints;

        if (searchTerm) {
            filtered = filtered.filter(
                (complaint) =>
                    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    complaint.userName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredComplaints(filtered);
    };

    const handleStatusFilter = async (status: ComplaintStatus | "ALL") => {
        setStatusFilter(status);
        if (status !== "ALL") {
            try {
                await getComplaintsByStatus(status);
            } catch (err) {
                toast.error("Failed to filter complaints");
            }
        }
    };

    const handleStatusChange = async (complaintId: string, newStatus: ComplaintStatus) => {
        // Optimistic update - update UI immediately
        setFilteredComplaints(prev =>
            prev.map(c => c.complaintId === complaintId ? { ...c, status: newStatus } : c)
        );

        try {
            // Then make the backend call
            await changeComplaintStatus(complaintId, newStatus);
            toast.success("Status updated");
        } catch (err) {
            // Revert on error
            toast.error("Failed to update status");
            await loadComplaints();
        }
    };

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case ComplaintStatus.SUBMITTED:
                return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
            case ComplaintStatus.ACKNOWLEDGED:
                return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
            case ComplaintStatus.UNDER_REVIEW:
                return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
            case ComplaintStatus.IN_PROGRESS:
                return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
            case ComplaintStatus.RESOLVED:
                return "bg-green-500/10 text-green-700 dark:text-green-400";
            case ComplaintStatus.REJECTED:
                return "bg-red-500/10 text-red-700 dark:text-red-400";
            default:
                return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
        }
    };

    const getStatusLabel = (status: ComplaintStatus) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (isLoading && filteredComplaints.length === 0) {
        return (
            <div className="min-h-screen">
                <div className="flex items-center justify-center min-h-[80vh]">
                    <SmoothLoader />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 pt-20 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Complaints Management</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage and update complaint statuses
                            </p>
                        </div>
                        <Button onClick={loadComplaints} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Filter Complaints</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, description, category, or user..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        <SelectItem value={ComplaintStatus.SUBMITTED}>Submitted</SelectItem>
                                        <SelectItem value={ComplaintStatus.ACKNOWLEDGED}>Acknowledged</SelectItem>
                                        <SelectItem value={ComplaintStatus.UNDER_REVIEW}>Under Review</SelectItem>
                                        <SelectItem value={ComplaintStatus.IN_PROGRESS}>In Progress</SelectItem>
                                        <SelectItem value={ComplaintStatus.RESOLVED}>Resolved</SelectItem>
                                        <SelectItem value={ComplaintStatus.REJECTED}>Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Complaints List */}
                    <Card>
                        <CardHeader className="border-b">
                            <div>
                                <CardTitle className="text-sm">
                                    Complaints ({filteredComplaints.length})
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs">
                                    Click on a status dropdown to update
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {filteredComplaints.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <FileText className="h-16 w-16 mb-3 opacity-20" />
                                        <p className="text-lg font-medium">No complaints found</p>
                                        <p className="text-sm mt-1">Try adjusting your filters</p>
                                    </div>
                                ) : (
                                    filteredComplaints.map((complaint) => (
                                        <div
                                            key={complaint.complaintId}
                                            className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base">
                                                        {complaint.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {complaint.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        <Badge variant="outline" className="text-xs">{complaint.category}</Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                        {complaint.userName && (
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {complaint.userName}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge className={`${getStatusColor(complaint.status)} shrink-0 text-xs`}>
                                                    {getStatusLabel(complaint.status)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 pt-2 border-t">
                                                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                                <Select
                                                    value={complaint.status}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(
                                                            complaint.complaintId,
                                                            value as ComplaintStatus
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={ComplaintStatus.SUBMITTED}>
                                                            Submitted
                                                        </SelectItem>
                                                        <SelectItem value={ComplaintStatus.ACKNOWLEDGED}>
                                                            Acknowledged
                                                        </SelectItem>
                                                        <SelectItem value={ComplaintStatus.UNDER_REVIEW}>
                                                            Under Review
                                                        </SelectItem>
                                                        <SelectItem value={ComplaintStatus.IN_PROGRESS}>
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value={ComplaintStatus.RESOLVED}>
                                                            Resolved
                                                        </SelectItem>
                                                        <SelectItem value={ComplaintStatus.REJECTED}>
                                                            Rejected
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ComplaintsManagement;
