import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Camera, Check, X } from "lucide-react";
import { Label } from "../ui/label";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { updateProfile } = useUserStore();

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ").filter(n => n);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0]?.slice(0, 2).toUpperCase() || "U";
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSaveImage = async () => {
        if (!selectedImage) return;
        try {
            setIsSaving(true);
            await updateProfile(user.name, selectedImage);
            toast.success("Profile image updated successfully!");

            // Reset selection after successful upload
            setSelectedImage(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Failed to update profile image:", error);
            toast.error("Failed to update profile image. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelImage = () => {
        setSelectedImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-6">
            <input
                aria-label="image-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />
            <Card className="border-border/50 shadow-lg">
                <CardContent className="">
                    <div className="flex  sm:flex-row  gap-6 md:flex-row items-center sm:items-center">
                        <div className="relative">
                            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                                <AvatarImage
                                    src={previewUrl || user.profileImageUrl}
                                    alt={user.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-2xl font-bold">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            {!selectedImage ? (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                                    onClick={handleCameraClick}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="absolute -right-2 -bottom-2 flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white border-green-600"
                                        onClick={handleSaveImage}
                                        title="Save image"
                                        disabled={isSaving}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white border-red-600"
                                        onClick={handleCancelImage}
                                        title="Cancel"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
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
