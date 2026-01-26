import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";

interface AccountSettingsProps {
    user: {
        name: string;
        email: string;
        createdAt: string;
    };
    onLogout: () => void;
}

export const AccountSettings = ({ user, onLogout }: AccountSettingsProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user.name);

    const handleSave = () => {
        // TODO: Implement API call to update user profile
        setIsEditing(false);
    };

    // const handleCancel = () => {
    //     setEditedName(user.name);
    //     setIsEditing(false);
    // };

    return (
        <div className="space-y-6">
            {/* Account Settings */}
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Account Status</Label>
                            <p className="text-muted-foreground text-sm">Your account is currently active</p>
                        </div>
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                            Active
                        </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Edit Profile</Label>
                            <p className="text-muted-foreground text-sm">Update your name and profile information</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                    </div>

                    {isEditing && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}

                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Email Address</Label>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                        </div>
                    </div>

                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Member Since</Label>
                            <p className="text-muted-foreground text-sm">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logout Section */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Sign Out</CardTitle>
                    <CardDescription>Log out of your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Logout</Label>
                            <p className="text-muted-foreground text-sm">
                                Sign out from your current session
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={onLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
