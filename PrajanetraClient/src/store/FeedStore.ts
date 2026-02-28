import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

export interface FeedPost {
    complaintId: string;
    title: string;
    description: string;
    category: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    status: string;
    imageUrls: string[];
    userId: string;
    userName: string;
    userProfileImage: string;
    likesCount: number;
    commentsCount: number;
    likedByCurrentUser: boolean;
    savedByCurrentUser: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FeedPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

interface FeedState {
    posts: FeedPost[];
    trendingPosts: FeedPost[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    pagination: FeedPagination;
    selectedCategory: string | null;
    selectedStatus: string | null;
    sortBy: string;

    fetchFeed: (page?: number, reset?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    fetchTrending: (limit?: number) => Promise<void>;
    fetchUserFeed: (userId: string, page?: number) => Promise<void>;
    setCategory: (category: string | null) => void;
    setStatus: (status: string | null) => void;
    setSortBy: (sort: string) => void;
    toggleLike: (complaintId: string, userId: string) => Promise<void>;
    toggleSave: (complaintId: string, userId: string) => Promise<void>;
    clearFeed: () => void;
    clearError: () => void;
}

const defaultPagination: FeedPagination = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
};

export const useFeedStore = create<FeedState>((set, get) => ({
    posts: [],
    trendingPosts: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    pagination: { ...defaultPagination },
    selectedCategory: null,
    selectedStatus: null,
    sortBy: "latest",

    fetchFeed: async (page = 0, reset = true) => {
        if (page === 0 && reset) {
            set({ isLoading: true, error: null });
        } else {
            set({ isLoadingMore: true, error: null });
        }

        try {
            const { selectedCategory, selectedStatus, sortBy } = get();
            const params: Record<string, string | number> = { page, size: 10, sortBy };
            if (selectedCategory) params.category = selectedCategory;
            if (selectedStatus) params.status = selectedStatus;

            const res = await axiosInstance.get("/feed", { params });
            const data = res.data;

            set({
                posts: reset ? data.posts : [...get().posts, ...data.posts],
                pagination: {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalItems: data.totalItems,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious,
                },
                isLoading: false,
                isLoadingMore: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.error || err.message || "Failed to load feed",
                isLoading: false,
                isLoadingMore: false,
            });
        }
    },

    loadMore: async () => {
        const { pagination, isLoadingMore, isLoading } = get();
        if (!pagination.hasNext || isLoadingMore || isLoading) return;
        await get().fetchFeed(pagination.currentPage + 1, false);
    },

    fetchTrending: async (limit = 10) => {
        try {
            const res = await axiosInstance.get("/feed/trending", { params: { limit } });
            set({ trendingPosts: res.data });
        } catch (err: any) {
            console.error("Failed to fetch trending:", err);
        }
    },

    fetchUserFeed: async (userId: string, page = 0) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/feed/user/${userId}`, {
                params: { page, size: 10 },
            });
            const data = res.data;
            set({
                posts: data.posts,
                pagination: {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalItems: data.totalItems,
                    hasNext: data.hasNext,
                    hasPrevious: false,
                },
                isLoading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "Failed to load user feed",
                isLoading: false,
            });
        }
    },

    setCategory: (category) => {
        set({ selectedCategory: category, posts: [], pagination: { ...defaultPagination } });
        get().fetchFeed(0, true);
    },

    setStatus: (status) => {
        set({ selectedStatus: status, posts: [], pagination: { ...defaultPagination } });
        get().fetchFeed(0, true);
    },

    setSortBy: (sort) => {
        set({ sortBy: sort, posts: [], pagination: { ...defaultPagination } });
        get().fetchFeed(0, true);
    },

    toggleLike: async (complaintId: string, userId: string) => {
        // Optimistic update
        const prevPosts = [...get().posts];
        set({
            posts: get().posts.map((post) =>
                post.complaintId === complaintId
                    ? {
                        ...post,
                        likedByCurrentUser: !post.likedByCurrentUser,
                        likesCount: post.likedByCurrentUser
                            ? post.likesCount - 1
                            : post.likesCount + 1,
                    }
                    : post
            ),
        });

        try {
            await axiosInstance.put(
                `/complaints/toggle/like?complaintId=${complaintId}&userId=${userId}`
            );
        } catch (err: any) {
            // Revert on failure
            set({ posts: prevPosts });
        }
    },

    toggleSave: async (complaintId: string, userId: string) => {
        const prevPosts = [...get().posts];
        set({
            posts: get().posts.map((post) =>
                post.complaintId === complaintId
                    ? {
                        ...post,
                        savedByCurrentUser: !post.savedByCurrentUser,
                    }
                    : post
            ),
        });

        try {
            await axiosInstance.put(
                `/complaints/toggle/save?complaintId=${complaintId}&userId=${userId}`
            );
        } catch (err: any) {
            set({ posts: prevPosts });
        }
    },

    clearFeed: () =>
        set({ posts: [], trendingPosts: [], pagination: { ...defaultPagination } }),

    clearError: () => set({ error: null }),
}));