import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Heart,
    MessageCircle,
    Bookmark,
    MapPin,
    Share2,
    ExternalLink,
    MoreHorizontal,
    Flag,
    Copy,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useComplaintStore, type Complaint } from "@/store/complaintStore";

interface ComplaintCardProps {
    complaint: Complaint;
    onOpenComments: (complaintId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
    SUBMITTED: "bg-gray-500",
    ACKNOWLEDGED: "bg-yellow-500",
    UNDER_REVIEW: "bg-orange-500",
    IN_PROGRESS: "bg-blue-500",
    RESOLVED: "bg-green-500",
    REJECTED: "bg-red-500",
};

const CATEGORY_ICONS: Record<string, string> = {
    "Road & Infrastructure": "🛣️",
    "Water Supply": "💧",
    "Garbage Collection": "🗑️",
    "Street Lights": "💡",
    "Drainage": "🌊",
    "Public Property": "🏛️",
    Other: "📋",
};

const ComplaintCard = ({ complaint, onOpenComments }: ComplaintCardProps) => {
    const { toggleLike, toggleSave } = useComplaintStore();
    const { user, isAuthenticated } = useUserStore();
    const navigate = useNavigate();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleLike = () => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to upvote");
            navigate("/login");
            return;
        }
        toggleLike(complaint.complaintId, user.userId);
    };

    const handleSave = () => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to save posts");
            navigate("/login");
            return;
        }
        toggleSave(complaint.complaintId, user.userId);
    };

    const handleShare = async () => {
        const shareData = {
            title: complaint.title,
            text: `${complaint.title} - ${complaint.category} complaint at ${complaint.formattedAddress}`,
            url: `${window.location.origin}/track?id=${complaint.complaintId}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(
                    `${window.location.origin}/track?id=${complaint.complaintId}`
                );
                toast.success("Link copied to clipboard!");
            }
        } catch {
            // User cancelled
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/track?id=${complaint.complaintId}`
            );
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleTrack = () => {
        navigate(`/track?id=${complaint.complaintId}`);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffInHours = Math.floor(
                (now.getTime() - date.getTime()) / (1000 * 60 * 60)
            );

            if (diffInHours < 1) return "just now";
            if (diffInHours < 24) return `${diffInHours}h ago`;
            if (diffInHours < 48) return "1d ago";
            if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
            if (diffInHours < 8760)
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "";
        }
    };

    const statusColor = STATUS_COLORS[complaint.status] || STATUS_COLORS.SUBMITTED;
    const statusLabel = complaint.status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    const categoryIcon = CATEGORY_ICONS[complaint.category] || "📋";
    const descriptionIsLong = complaint.description.length > 150;
    const hasImages = complaint.imageUrls && complaint.imageUrls.length > 0;

    return (
        <Card className="w-full max-w-[470px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[630px] mx-auto rounded-xl border bg-card overflow-hidden py-0 gap-0">
            {/* ─── Header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                    {/* Gradient avatar ring like Instagram */}
                    <div className="h-9 w-9 rounded-full bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
                        <Avatar className="h-full w-full border-2 border-card">
                            <AvatarImage
                                src={complaint.userProfileImage}
                                alt={complaint.userName}
                            />
                            <AvatarFallback className="text-xs font-semibold bg-card">
                                {complaint.userName?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-sm truncate">
                            {complaint.userName || "Anonymous User"}
                        </span>
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(complaint.createdAt)}
                        </span>
                        <Badge
                            className={`${statusColor} text-white text-[10px] ml-1 px-1.5 py-0 h-5 shrink-0`}
                        >
                            {statusLabel}
                        </Badge>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer p-1"
                            aria-label="More options"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleTrack}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Track Complaint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ─── Image Carousel ──────────────────────────────────── */}
            <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                {hasImages ? (
                    complaint.imageUrls.length === 1 ? (
                        <img
                            src={complaint.imageUrls[0]}
                            alt={complaint.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                                {complaint.imageUrls.map((imageUrl, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <img
                                            src={imageUrl}
                                            alt={`${complaint.title} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No images</p>
                    </div>
                )}

                {/* Location Badge overlay */}
                {complaint.formattedAddress && (
                    <Badge
                        variant="outline"
                        className="absolute bottom-2 right-2 bg-black/60 text-white border-0 backdrop-blur-sm text-[11px] gap-1"
                    >
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1 max-w-[180px]">
                            {complaint.formattedAddress}
                        </span>
                    </Badge>
                )}
            </div>

            {/* ─── Actions & Content ────────────────────────────────── */}
            <CardContent className="p-3 space-y-2">
                {/* Action Buttons Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            aria-label="Upvote complaint"
                        >
                            <motion.div
                                whileTap={{ scale: 0.7 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                }}
                            >
                                <Heart
                                    className={`h-6 w-6 transition-colors duration-200 ${complaint.likedByCurrentUser
                                        ? "fill-red-500 text-red-500"
                                        : ""
                                        }`}
                                />
                            </motion.div>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={() => onOpenComments(complaint.complaintId)}
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            aria-label="Comment on complaint"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </button>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            aria-label="Share complaint"
                        >
                            <Share2 className="h-5.5 w-5.5" />
                        </button>
                    </div>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="hover:text-muted-foreground transition-colors cursor-pointer"
                        aria-label="Save complaint"
                    >
                        <motion.div
                            whileTap={{ scale: 0.7 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                            }}
                        >
                            <Bookmark
                                className={`h-6 w-6 transition-colors duration-200 ${complaint.savedByCurrentUser
                                    ? "fill-foreground text-foreground"
                                    : ""
                                    }`}
                            />
                        </motion.div>
                    </button>
                </div>

                {/* Likes count */}
                {complaint.likesCount > 0 && (
                    <p className="font-semibold text-sm">
                        {complaint.likesCount.toLocaleString()}{" "}
                        {complaint.likesCount === 1 ? "upvote" : "upvotes"}
                    </p>
                )}

                {/* Title + Category + Description */}
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="font-semibold">
                            {categoryIcon} {complaint.category}
                        </span>
                        {" • "}
                        <span className="font-medium">{complaint.title}</span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {descriptionIsLong && !isDescriptionExpanded
                            ? complaint.description.slice(0, 150) + "..."
                            : complaint.description}
                    </p>
                    {descriptionIsLong && (
                        <button
                            onClick={() =>
                                setIsDescriptionExpanded(!isDescriptionExpanded)
                            }
                            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isDescriptionExpanded ? "less" : "more"}
                        </button>
                    )}
                </div>

                {/* View Comments Link */}
                {complaint.commentsCount > 0 && (
                    <button
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                        onClick={() => onOpenComments(complaint.complaintId)}
                    >
                        View all {complaint.commentsCount} comments
                    </button>
                )}

                {/* Footer: Track */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">
                            {complaint.formattedAddress || "Unknown location"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ComplaintCard;