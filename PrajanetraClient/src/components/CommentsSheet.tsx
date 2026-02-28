import { useState, useEffect, useRef } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, HeartOff, Loader2, Send, Trash2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { useCommentsStore } from "@/store/commentsStore";

interface CommentsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    complaintId: string | null;
}

const CommentsSheet = ({ open, onOpenChange, complaintId }: CommentsSheetProps) => {
    const { user, isAuthenticated } = useUserStore();
    const {
        comments,
        isFetching,
        isAdding,
        isDeleting,
        isLiking,
        fetchComments,
        addComment,
        clearComments,
        toggleLike,
        deleteComment
    } = useCommentsStore();

    const [commentText, setCommentText] = useState("");
    // Remove local submitting state, use isAdding from store
    const inputRef = useRef<HTMLInputElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Fetch comments when sheet opens
    useEffect(() => {
        if (open && complaintId) {
            fetchComments(complaintId);
        }
        if (!open) {
            clearComments();
            setCommentText("");
        }
    }, [open, complaintId, fetchComments, clearComments]);

    // Auto focus input when sheet opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    const handleLike = async (commentId: string) => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to like comments");
            return;
        }
        if (isLiking) return;
        try {
            await toggleLike(commentId, user.userId);
        } catch {
            toast.error("Failed to like comment");
        }
    };

    const handleDeleteClick = (commentId: string) => {
        setDeleteTargetId(commentId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!isAuthenticated || !user || !deleteTargetId) {
            setDeleteDialogOpen(false);
            return;
        }
        if (isDeleting) return;
        try {
            await deleteComment(deleteTargetId);
            toast.success("Comment deleted");
        } catch {
            toast.error("Failed to delete comment");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
        }
    };
    const handleSubmit = async () => {
        if (!commentText.trim() || !complaintId) return;

        if (!isAuthenticated || !user) {
            toast.error("Please login to comment");
            return;
        }
        if (isAdding) return;
        try {
            await addComment(complaintId, user.userId, commentText.trim());
            setCommentText("");
            toast.success("Comment posted!");
        } catch {
            toast.error("Failed to post comment");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch {
            return "";
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl px-0 flex flex-col max-w-[630px] mx-auto">
                {/* Header */}
                <SheetHeader className="px-4 pb-3 border-b border-border/40">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                    <SheetTitle className="text-center text-base">
                        Comments{" "}
                        {comments.length > 0 && (
                            <span className="text-muted-foreground font-normal">
                                ({comments.length})
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {/* Comments List */}
                <ScrollArea className="flex-1 px-4 overflow-y-auto">
                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Loading comments...</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <p className="text-4xl">💬</p>
                            <p className="text-sm font-medium text-muted-foreground">
                                No comments yet
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Be the first to share your thoughts
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            <div className="space-y-4 py-4">
                                {comments.map((comment, index) => (
                                    <motion.div
                                        key={comment.commentId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                                        className="flex gap-3"
                                    >
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                            <AvatarImage src={comment.userProfileImage} />
                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-muted/50 rounded-xl px-3 py-2">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <span className="text-sm font-semibold truncate">
                                                        {comment.userName}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed wrap-break-word">
                                                    {comment.text}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 px-1">
                                                <span className="text-[11px] text-muted-foreground">
                                                    {formatTime(comment.createdAt)}
                                                </span>
                                                <button
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
                                                    onClick={() => handleLike(comment.commentId)}
                                                    disabled={!isAuthenticated || isLiking}
                                                    aria-label={comment.isLiked ? "Unlike" : "Like"}
                                                >
                                                    {isLiking && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    )}
                                                    {!isLiking && (comment.isLiked ? (
                                                        <Heart className="h-4 w-4 text-primary fill-primary" />
                                                    ) : (
                                                        <HeartOff className="h-4 w-4" />
                                                    ))}
                                                    <span>{comment.likes}</span>
                                                </button>
                                                {isAuthenticated && user?.userId === comment.userId && (
                                                    <button
                                                        className="ml-2 text-xs text-muted-foreground hover:text-destructive transition"
                                                        onClick={() => handleDeleteClick(comment.commentId)}
                                                        aria-label="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border/40 px-4 py-3 bg-background">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={user?.profileImageUrl} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                                <Input
                                    ref={inputRef}
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isAdding}
                                    className="pr-12 rounded-full bg-muted/50 border-border/50"
                                />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleSubmit}
                                    disabled={!commentText.trim() || isAdding}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full text-primary hover:text-primary disabled:opacity-30"
                                >
                                    {isAdding ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-center text-muted-foreground py-1">
                            <a href="/login" className="text-primary font-medium hover:underline">
                                Login
                            </a>{" "}
                            to join the conversation
                        </p>
                    )}
                </div>
                {/* Delete Confirmation Dialog */}
                {deleteDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-background rounded-lg shadow-lg p-6 w-[320px]">
                            <h2 className="text-lg font-semibold mb-2">Delete Comment?</h2>
                            <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this comment? This action cannot be undone.</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CommentsSheet;