import { useState } from "react";
import { motion } from "motion/react";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Calendar,
    Edit2,
    Save,
    X,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout, isAuthenticated } = useUserStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || "");

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        navigate("/login");
        return null;
    }

    // Get initials for avatar
    const getInitials = (name: string) => {
        console.log(user);
        const parts = name.trim().split(" ").filter(n => n);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0]?.slice(0, 2).toUpperCase() || "U";
    };

    // Get user complaints and stats from userStore
    const totalComplaints = user.complaints?.length || 0;
    const resolvedComplaintsCount = user.resolvedComplaints || 0;

    // TODO: Fetch full complaint details from API using complaint IDs
    // For now, we'll display the complaint IDs from user.complaints
    // In the future, you should call an API endpoint to get full complaint details

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Resolved":
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "In Progress":
                return <Clock className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Resolved":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "In Progress":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        }
    };

    const handleSave = () => {
        // TODO: Implement API call to update user profile
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(user.name);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen inset-0 bg-linear-to-b from-background/80 via-background/70 to-background/60">
            <motion.div
                className="container mx-auto px-4 pt-24 pb-12 max-w-7xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Profile
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account and view your activity
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader className="text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                                        <AvatarImage src={user.profileImageUrl} alt={user.name} />
                                        <AvatarFallback className="text-2xl font-bold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {isEditing ? (
                                        <div className="w-full space-y-2">
                                            <Input
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="text-center"
                                            />
                                            <div className="flex gap-2 justify-center">
                                                <Button size="sm" onClick={handleSave}>
                                                    <Save className="w-4 h-4 mr-1" />
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                                    <X className="w-4 h-4 mr-1" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                                <CardDescription className="mt-1">{user.email}</CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center space-x-3 text-sm">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">User ID:</span>
                                    <span className="font-mono text-xs">{user.userId ? user.userId : "N/A"}</span>
                                </div>

                                <div className="flex items-center space-x-3 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="truncate">{user.email}</span>
                                </div>

                                <div className="flex items-center space-x-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Joined:</span>
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>

                                {user.googleId && (
                                    <div className="pt-2">
                                        <Badge variant="outline" className="w-full justify-center">
                                            Connected with Google
                                        </Badge>
                                    </div>
                                )}

                                <Separator />

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column - Complaints & Activity */}
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                        <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                        <div className="text-2xl font-bold">
                                            {totalComplaints - resolvedComplaintsCount}
                                        </div>
                                        <div className="text-sm text-muted-foreground">In Progress</div>
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

                        {/* Recent Complaints */}
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Your Complaints</CardTitle>
                                        <CardDescription>View and track all your submitted complaints</CardDescription>
                                    </div>
                                    <Button onClick={() => navigate("/complaint")}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        New Complaint
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    {user.complaints && user.complaints.length > 0 ? (
                                        user.complaints.map((complaintId, index) => (
                                            <motion.div
                                                key={complaintId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + index * 0.1 }}
                                            >
                                                <Card className="border-border/30 hover:border-primary/50 transition-colors cursor-pointer">
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                                                    <h3 className="font-semibold truncate">Complaint ID: {complaintId}</h3>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                                    <span className="font-mono text-xs">{complaintId}</span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                    Click to view full details
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                            <h3 className="text-lg font-semibold mb-2">No complaints yet</h3>
                                            <p className="text-muted-foreground mb-4">
                                                You haven't submitted any complaints yet.
                                            </p>
                                            <Button onClick={() => navigate("/complaint")}>
                                                <FileText className="w-4 h-4 mr-2" />
                                                File Your First Complaint
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <Button variant="outline" onClick={() => navigate("/track")}>
                                        View All Complaints
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
