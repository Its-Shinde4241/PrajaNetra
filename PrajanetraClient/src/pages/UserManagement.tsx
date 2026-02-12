import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Search, UserPlus, UserMinus, RefreshCw, Users, UserCog } from "lucide-react";
import { SmoothLoader } from "@/components/ui/smooth-loader";

const UserManagement = () => {
    const {
        users,
        staffMembers,
        regularUsers,
        isLoading,
        error,
        getAllUsers,
        getAllStaffMembers,
        getAllRegularUsers,
        makeStaff,
        revokeStaffRole,
        clearError,
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStaff, setFilteredStaff] = useState(staffMembers);
    const [filteredRegular, setFilteredRegular] = useState(regularUsers);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error]);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users, staffMembers, regularUsers]);

    const loadUsers = async () => {
        try {
            await Promise.all([
                getAllUsers(),
                getAllStaffMembers(),
                getAllRegularUsers(),
            ]);
        } catch (err) {
            toast.error("Failed to load users");
        }
    };

    const filterUsers = () => {
        const term = searchTerm.toLowerCase();

        setFilteredStaff(
            staffMembers.filter(
                (user) =>
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.userId.toLowerCase().includes(term)
            )
        );

        setFilteredRegular(
            regularUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.userId.toLowerCase().includes(term)
            )
        );
    };

    const handleMakeStaff = async (userId: string) => {
        // Optimistic update - remove from regular users immediately
        const user = filteredRegular.find(u => u.userId === userId);
        if (user) {
            setFilteredRegular(prev => prev.filter(u => u.userId !== userId));
            setFilteredStaff(prev => [...prev, { ...user, roles: [...(user.roles || []), "STAFF"] }]);
        }

        try {
            await makeStaff(userId);
            toast.success("User promoted to staff");
        } catch (err) {
            toast.error("Failed to promote user");
            // Reload on error to revert
            await loadUsers();
        }
    };

    const handleRevokeStaff = async (userId: string) => {
        // Optimistic update - remove from staff immediately
        const user = filteredStaff.find(u => u.userId === userId);
        if (user) {
            setFilteredStaff(prev => prev.filter(u => u.userId !== userId));
            setFilteredRegular(prev => [...prev, { ...user, roles: (user.roles || []).filter(r => r !== "STAFF") }]);
        }

        try {
            await revokeStaffRole(userId);
            toast.success("Staff role revoked");
        } catch (err) {
            toast.error("Failed to revoke staff role");
            // Reload on error to revert
            await loadUsers();
        }
    };

    if (isLoading && users.length === 0) {
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
                            <h1 className="text-2xl font-bold">User Management</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage user roles and permissions
                            </p>
                        </div>
                        <Button onClick={loadUsers} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Staff Members</CardTitle>
                                <UserCog className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 pb-3">
                                <div className="text-lg font-bold">{staffMembers.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Regular Users</CardTitle>
                                <Users className="h-3 w-3 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-3 pb-3">
                                <div className="text-lg font-bold">{regularUsers.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Search Users</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or user ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Tabs */}
                    <Tabs defaultValue="regular" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="regular">Regular Users ({filteredRegular.length})</TabsTrigger>
                            <TabsTrigger value="staff">Staff Members ({filteredStaff.length})</TabsTrigger>
                        </TabsList>

                        {/* Staff Members Tab */}
                        <TabsContent value="staff">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Staff Members</CardTitle>
                                    <CardDescription className="text-xs">
                                        Currently active staff members
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {filteredStaff.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8 text-sm">
                                                No staff members found
                                            </p>
                                        ) : (
                                            filteredStaff.map((staff) => (
                                                <div
                                                    key={staff.userId}
                                                    className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-sm">{staff.name}</p>
                                                            <Badge variant="default" className="text-xs">STAFF</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {staff.email}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRevokeStaff(staff.userId)}
                                                        className="ml-2 shrink-0"
                                                    >
                                                        <UserMinus className="h-3 w-3 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Regular Users Tab */}
                        <TabsContent value="regular">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Regular Users</CardTitle>
                                    <CardDescription className="text-xs">
                                        Users without staff privileges
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {filteredRegular.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8 text-sm">
                                                No regular users found
                                            </p>
                                        ) : (
                                            filteredRegular.map((user) => (
                                                <div
                                                    key={user.userId}
                                                    className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleMakeStaff(user.userId)}
                                                        className="ml-2 shrink-0"
                                                    >
                                                        <UserPlus className="h-3 w-3 mr-1" />
                                                        Promote
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
};

export default UserManagement;
