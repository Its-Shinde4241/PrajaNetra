import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useComplaintStore } from "@/store/complaintStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profilecomponents/ProfileHeader";
import { AccountSettings } from "@/components/profilecomponents/AccountSettings";
import { ComplaintsSection } from "@/components/profilecomponents/ComplaintsSection";
import { Loader2, Save } from "lucide-react";
import { LikedComplaintsSection } from "@/components/profilecomponents/LikedComplaintsSection";
import { SavedComplaintsSection } from "@/components/profilecomponents/SavedComplaintsSection";

const Profile = () => {
    const { user, logout, isAuthenticated } = useUserStore();
    const { userComplaints, getUserComplaints, isLoading } = useComplaintStore();
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login");
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch user complaints on mount
    useEffect(() => {
        if (user?.userId) {
            getUserComplaints(user.userId);
        }
    }, [user?.userId, getUserComplaints]);

    // Handle refresh complaints
    const handleRefreshComplaints = async () => {
        if (user?.userId) {
            try {
                await getUserComplaints(user.userId);
                toast.success("Complaints refreshed successfully");
            } catch (error) {
                toast.error("Failed to refresh complaints");
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Show loader while initial data is loading
    if (isLoading && userComplaints.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-b from-background/80 via-background/70 to-background/60 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-background/80 via-background/70 to-background/60">
            <div className="px-6 sm:px-10 md:px-10 lg:px-72 pt-18 pb-12">

                {/* Profile Header */}
                {user && <ProfileHeader user={user} />}

                {/* Tabs Content */}
                <div>
                    <Tabs defaultValue="account" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="complaints">Complaints</TabsTrigger>
                            <TabsTrigger value="liked">Liked</TabsTrigger>
                            <TabsTrigger value="saved">Saved</TabsTrigger>
                        </TabsList>

                        {/* Account Settings Tab */}
                        <TabsContent value="account">
                            {user && <AccountSettings user={user} onLogout={handleLogout} />}
                        </TabsContent>

                        {/* Complaints Tab */}
                        <TabsContent value="complaints">
                            <ComplaintsSection
                                userComplaints={userComplaints}
                                isLoading={isLoading}
                                onRefresh={handleRefreshComplaints}
                                onNewComplaint={() => navigate("/complaint")}
                                onViewAll={() => navigate("/my-complaints")}
                            />
                        </TabsContent>
                        <TabsContent value="liked">
                            <LikedComplaintsSection />
                        </TabsContent>
                        <TabsContent value="saved">
                            <SavedComplaintsSection />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Profile;
