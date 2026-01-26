import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Camera } from "lucide-react";

interface ProfileHeaderProps {
    user: {
        name: string;
        email: string;
        profileImageUrl?: string;
        googleId?: string;
        userId?: string;
        createdAt: string;
    };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const getInitials = (name: string) => {
        const parts = name.trim().split(" ").filter(n => n);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0]?.slice(0, 2).toUpperCase() || "U";
    };

    return (
        <div className="mb-6">
            <Card className="border-border/50 shadow-lg">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                        <div className="relative">
                            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                                <AvatarImage src={user.profileImageUrl} alt={user.name} />
                                <AvatarFallback className="text-2xl font-bold">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                {user.googleId && (
                                    <Badge variant="secondary">Connected with Google</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    ID: {user.userId || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
