import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";
import { useFeedStore } from "@/store/FeedStore";
import type { FeedPost } from "@/store/FeedStore";
import FeedPostCard from "@/components/FeedPostCard";
import CommentsSheet from "@/components/CommentsSheet";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw, Flame, ArrowUp } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
    "All",
    "Road & Infrastructure",
    "Water Supply",
    "Garbage Collection",
    "Street Lights",
    "Drainage",
    "Public Property",
    "Other",
];

const STATUS_OPTIONS = [
    { value: "ALL", label: "All Status" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "ACKNOWLEDGED", label: "Acknowledged" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "REJECTED", label: "Rejected" },
];

const Feed = () => {
    const {
        posts,
        trendingPosts,
        isLoading,
        isLoadingMore,
        pagination,
        fetchFeed,
        fetchTrending,
        loadMore,
        setCategory,
        setStatus,
        setSortBy,
        selectedCategory,
        selectedStatus,
        sortBy,
        error,
        clearError,
    } = useFeedStore();

    // Comments sheet state
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);

    // Scroll to top
    const [showScrollTop, setShowScrollTop] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    // ─── Infinite Scroll ──────────────────────────────────────────
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoadingMore) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && pagination.hasNext) {
                        loadMore();
                    }
                },
                { rootMargin: "300px" }
            );

            if (node) observerRef.current.observe(node);
        },
        [isLoadingMore, pagination.hasNext, loadMore]
    );

    // ─── Effects ──────────────────────────────────────────────────

    useEffect(() => {
        fetchFeed(0, true);
        fetchTrending(5);
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error]);

    // Track scroll position for "back to top" button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 800);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ─── Handlers ─────────────────────────────────────────────────

    const handleOpenComments = (complaintId: string) => {
        setActiveComplaintId(complaintId);
        setCommentsOpen(true);
    };

    const handleRefresh = () => {
        fetchFeed(0, true);
        fetchTrending(5);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ─── Render ───────────────────────────────────────────────────

    return (
        <div className="min-h-screen" ref={topRef}>
            <motion.div
                className="relative z-10 pt-16 pb-12 px-4 min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto max-w-2xl">
                    {/* ─── Header ──────────────────────────────────────── */}
                    <div className="text-center mb-2">
                        {/* <motion.h1
                            className="text-3xl md:text-4xl font-bold mb-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Community Feed
                        </motion.h1> */}
                        <motion.p
                            className="text-muted-foreground text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            See what's happening in your city
                            {pagination.totalItems > 0 && (
                                <span> · {pagination.totalItems.toLocaleString()} complaints</span>
                            )}
                        </motion.p>
                    </div>

                    {/* ─── Trending Bar ─────────────────────────────────── */}
                    {trendingPosts.length > 0 && (
                        <motion.div
                            className="mb-6 p-3 bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                                    TRENDING
                                </span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {trendingPosts.map((post) => (
                                    <button
                                        key={post.complaintId}
                                        onClick={() =>
                                            document
                                                .getElementById(`post-${post.complaintId}`)
                                                ?.scrollIntoView({ behavior: "smooth", block: "center" })
                                        }
                                        className="shrink-0 text-left bg-background/80 backdrop-blur-sm border border-border/40 rounded-lg px-3 py-2 hover:border-primary/40 transition-colors max-w-[200px]"
                                    >
                                        <p className="text-xs font-medium truncate">{post.title}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {post.likesCount} upvotes · {post.commentsCount} comments
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Filters ──────────────────────────────────────── */}
                    <motion.div
                        className="flex flex-wrap gap-2 mb-6 sticky top-16 z-20 bg-background/85 backdrop-blur-lg py-3 px-1 -mx-1 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Category Filter */}
                        <Select
                            value={selectedCategory || "All"}
                            onValueChange={(val) => setCategory(val === "All" ? null : val)}
                        >
                            <SelectTrigger className="flex-1 min-w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="text-xs">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={selectedStatus || "ALL"}
                            onValueChange={(val) => setStatus(val === "ALL" ? null : val)}
                        >
                            <SelectTrigger className="w-[130px] h-9 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[110px] h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest" className="text-xs">Latest</SelectItem>
                                <SelectItem value="popular" className="text-xs">Popular</SelectItem>
                                <SelectItem value="oldest" className="text-xs">Oldest</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Refresh */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="h-9 w-9 shrink-0"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        </Button>
                    </motion.div>

                    {/* ─── Initial Loading ──────────────────────────────── */}
                    {isLoading && posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Loading community feed...
                            </p>
                        </div>
                    )}

                    {/* ─── Feed Posts ───────────────────────────────────── */}
                    <div className="space-y-5">
                        {posts.map((post: FeedPost, index: number) => (
                            <motion.div
                                key={post.complaintId}
                                id={`post-${post.complaintId}`}
                                ref={index === posts.length - 1 ? lastPostRef : undefined}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: Math.min(index * 0.04, 0.2),
                                }}
                            >
                                <FeedPostCard
                                    post={post}
                                    onOpenComments={handleOpenComments}
                                />
                            </motion.div>
                        ))}

                        {/* Loading More Indicator */}
                        {isLoadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">Loading more...</span>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !isLoadingMore && posts.length === 0 && (
                            <motion.div
                                className="text-center py-24"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p className="text-5xl mb-4">📭</p>
                                <p className="text-lg font-medium text-muted-foreground">
                                    No complaints found
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                    {selectedCategory || selectedStatus
                                        ? "Try changing the filters to see more results"
                                        : "Be the first to report an issue in your community!"}
                                </p>
                                {(selectedCategory || selectedStatus) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => {
                                            setCategory(null);
                                            setStatus(null);
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                                {!selectedCategory && !selectedStatus && (
                                    <Button
                                        className="mt-4"
                                        onClick={() => (window.location.href = "/complaint")}
                                    >
                                        File a Complaint
                                    </Button>
                                )}
                            </motion.div>
                        )}

                        {/* End of Feed */}
                        {!pagination.hasNext && posts.length > 0 && !isLoading && !isLoadingMore && (
                            <div className="text-center py-10 border-t border-border/30">
                                <p className="text-sm text-muted-foreground">
                                    You've reached the end 🎉
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-xs"
                                    onClick={scrollToTop}
                                >
                                    Back to top
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ─── Comments Sheet ────────────────────────────────────── */}
            <div className="relative flex flex-col items-center">
                <CommentsSheet
                    open={commentsOpen}
                    onOpenChange={setCommentsOpen}
                    complaintId={activeComplaintId}
                />
            </div>

            {/* ─── Scroll to Top FAB ────────────────────────────────── */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 h-10 w-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                    <ArrowUp className="h-5 w-5" />
                </motion.button>
            )}
        </div>
    );
};

export default Feed;