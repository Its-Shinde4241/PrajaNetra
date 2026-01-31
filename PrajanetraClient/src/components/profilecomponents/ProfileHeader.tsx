import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Camera } from "lucide-react";
import { Label } from "../ui/label";

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
                <CardContent className="">
                    <div className="flex  sm:flex-row  gap-6 md:flex-row items-center sm:items-center">
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
                        <div className="flex-1 space-y-0">
                            <div className="flex flex-col gap-2 items-center md:flex-row sm:items-start">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                {user.googleId && (
                                    <Badge variant="secondary">Connected with Google</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-center sm:text-start">{user.email}</p>
                            <div data-slot="info" className="text-muted-foreground flex flex-wrap justify-between text-sm sm:flex-row flex-col items-center">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    :&nbsp;{user.userId || "N/A"}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-x-0.5">
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
