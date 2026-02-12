import { useEffect } from "react";
import { useAdminStore, ComplaintStatus } from "@/store/adminStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
} from "lucide-react";
import { SmoothLoader } from "@/components/ui/smooth-loader";

const AdminDashboard = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const {
        dashboardStats,
        categoryStats,
        statusStats,
        recentComplaints,
        isLoading,
        error,
        getDashboardStats,
        getCategoryStats,
        getStatusStats,
        getRecentComplaints,
        clearError,
    } = useAdminStore();

    useEffect(() => {
        // Load all dashboard data on mount
        const loadDashboardData = async () => {
            try {
                await Promise.all([
                    getDashboardStats(),
                    getCategoryStats(),
                    getStatusStats(),
                    getRecentComplaints(20),
                ]);
            } catch (err) {
                toast.error("Failed to load dashboard data");
            }
        };
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error]);

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

    if (isLoading && !dashboardStats) {
        return (
            <div className="min-h-screen">
                {/* <Navbar /> */}
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
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Welcome back, {user?.name}
                            </p>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 items-center justify-center gap-3">
                        <Card className="gap-6">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
                                <FileText className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.totalComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Submitted</CardTitle>
                                <Clock className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.submittedComplaints || dashboardStats?.pendingComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Acknowledged</CardTitle>
                                <Activity className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.acknowledgedComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Under Review</CardTitle>
                                <Activity className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.underReviewComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">In Progress</CardTitle>
                                <Activity className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.inProgressComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Resolved</CardTitle>
                                <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.resolvedComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Rejected</CardTitle>
                                <XCircle className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.rejectedComplaints || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Total Users</CardTitle>
                                <Users className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 ">
                                <div className="text-lg font-bold">{dashboardStats?.totalUsers || 0}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/complaints')}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Complaints Management
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {recentComplaints.length} recent complaints
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/users')}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    User Management
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {dashboardStats?.totalUsers || 0} registered users
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Recent Complaints */}
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Recent Complaints</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/complaints')} className="h-7 text-xs">
                                        View All
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-2">
                                    {recentComplaints.slice(0, 5).map((complaint, index) => (
                                        <motion.div
                                            key={complaint.complaintId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-xs line-clamp-1">{complaint.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] h-4">{complaint.category}</Badge>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={`${getStatusColor(complaint.status)} ml-2 shrink-0 text-[10px] h-4`} variant="outline">
                                                {getStatusLabel(complaint.status)}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                    {recentComplaints.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                                            <FileText className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-xs">No recent complaints</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analytics Overview */}
                        <div className="space-y-3">
                            <Card>
                                <CardHeader className="border-b">
                                    <CardTitle className="text-sm">Category Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-2">
                                        {categoryStats && Object.entries(categoryStats).slice(0, 5).map(([category, count], index) => (
                                            <motion.div
                                                key={category}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <span className="text-xs font-medium capitalize">{category}</span>
                                                <Badge variant="secondary" className="font-bold text-xs h-5">{count}</Badge>
                                            </motion.div>
                                        ))}
                                        {(!categoryStats || Object.keys(categoryStats).length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                                                <FileText className="h-8 w-8 mb-2 opacity-20" />
                                                <p className="text-xs">No data available</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="border-b">
                                    <CardTitle className="text-sm">Status Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-2">
                                        {statusStats && Object.entries(statusStats).map(([status, count], index) => (
                                            <motion.div
                                                key={status}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <Badge className={getStatusColor(status as ComplaintStatus)} variant="outline">
                                                    {getStatusLabel(status as ComplaintStatus)}
                                                </Badge>
                                                <span className="font-bold text-base">{count}</span>
                                            </motion.div>
                                        ))}
                                        {(!statusStats || Object.keys(statusStats).length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                                                <Activity className="h-8 w-8 mb-2 opacity-20" />
                                                <p className="text-xs">No data available</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;