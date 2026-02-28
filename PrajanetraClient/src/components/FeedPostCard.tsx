import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { FeedPost } from "@/store/FeedStore";
import { useFeedStore } from "@/store/FeedStore";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";

interface FeedPostCardProps {
    post: FeedPost;
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
    Drainage: "🌊",
    "Public Property": "🏛️",
    Other: "📋",
};

const FeedPostCard = ({ post, onOpenComments }: FeedPostCardProps) => {
    const { toggleLike, toggleSave } = useFeedStore();
    const { user, isAuthenticated } = useUserStore();
    const navigate = useNavigate();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleLike = () => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to upvote");
            navigate("/login");
            return;
        }
        toggleLike(post.complaintId, user.userId);
    };

    const handleSave = () => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to save posts");
            navigate("/login");
            return;
        }
        toggleSave(post.complaintId, user.userId);
    };

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: `${post.title} - ${post.category} complaint at ${post.formattedAddress}`,
            url: `${window.location.origin}/track?id=${post.complaintId}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(
                    `${window.location.origin}/track?id=${post.complaintId}`
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
                `${window.location.origin}/track?id=${post.complaintId}`
            );
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleTrack = () => {
        navigate(`/track?id=${post.complaintId}`);
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

    const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.SUBMITTED;
    const statusLabel = post.status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    const categoryIcon = CATEGORY_ICONS[post.category] || "📋";
    const descriptionIsLong = post.description.length > 150;
    const hasImages = post.imageUrls && post.imageUrls.length > 0;

    return (
        <Card className="w-full max-w-[470px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[630px] mx-auto rounded-xl border bg-card overflow-hidden py-0 gap-0">
            {/* ─── Header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                    {/* Gradient avatar ring like Instagram */}
                    <div className="h-9 w-9 rounded-full bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
                        <Avatar className="h-full w-full border-2 border-card">
                            <AvatarImage
                                src={post.userProfileImage}
                                alt={post.userName}
                            />
                            <AvatarFallback className="text-xs font-semibold bg-card">
                                {post.userName?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-sm truncate">
                            {post.userName || "Anonymous User"}
                        </span>
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(post.createdAt)}
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
                    post.imageUrls.length === 1 ? (
                        <img
                            src={post.imageUrls[0]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                                {post.imageUrls.map((imageUrl, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <img
                                            src={imageUrl}
                                            alt={`${post.title} - Image ${index + 1}`}
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
                {post.formattedAddress && (
                    <Badge
                        variant="outline"
                        className="absolute bottom-2 right-2 bg-black/60 text-white border-0 backdrop-blur-sm text-[11px] gap-1"
                    >
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1 max-w-[180px]">
                            {post.formattedAddress}
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
                                    className={`h-6 w-6 transition-colors duration-200 ${post.likedByCurrentUser
                                        ? "fill-red-500 text-red-500"
                                        : ""
                                        }`}
                                />
                            </motion.div>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={() => onOpenComments(post.complaintId)}
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
                                className={`h-6 w-6 transition-colors duration-200 ${post.savedByCurrentUser
                                    ? "fill-foreground text-foreground"
                                    : ""
                                    }`}
                            />
                        </motion.div>
                    </button>
                </div>

                {/* Likes count */}
                {post.likesCount > 0 && (
                    <p className="font-semibold text-sm">
                        {post.likesCount.toLocaleString()}{" "}
                        {post.likesCount === 1 ? "upvote" : "upvotes"}
                    </p>
                )}

                {/* Title + Category + Description */}
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="font-semibold">
                            {categoryIcon} {post.category}
                        </span>
                        {" • "}
                        <span className="font-medium">{post.title}</span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {descriptionIsLong && !isDescriptionExpanded
                            ? post.description.slice(0, 150) + "..."
                            : post.description}
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
                {post.commentsCount > 0 && (
                    <button
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                        onClick={() => onOpenComments(post.complaintId)}
                    >
                        View all {post.commentsCount} comments
                    </button>
                )}

                {/* Footer: Track */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">
                            {post.formattedAddress || "Unknown location"}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary hover:text-primary gap-1 h-7 px-2"
                        onClick={handleTrack}
                    >
                        Track
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeedPostCard;