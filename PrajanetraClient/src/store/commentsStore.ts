import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

export interface Comment {
    commentId: string;
    text: string;
    likes: number;
    userId: string;
    userName: string;
    userProfileImage: string;
    complaintId: string;
    likedByUsers: string[];
    isLiked: boolean;
    createdAt: string;
}

interface CommentsPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

interface CommentsState {
    comments: Comment[];
    isLoading: boolean; // deprecated, kept for backward compatibility
    isFetching: boolean;
    isAdding: boolean;
    isDeleting: boolean;
    isLiking: boolean;
    error: string | null;
    pagination: CommentsPagination;
    fetchComments: (complaintId: string, page?: number) => Promise<void>;
    addComment: (complaintId: string, userId: string, text: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    toggleLike: (commentId: string, userId: string) => Promise<void>;
    clearComments: () => void;
    clearError: () => void;
}

const defaultPagination: CommentsPagination = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
    comments: [] as Comment[],
    isLoading: false, // deprecated
    isFetching: false,
    isAdding: false,
    isDeleting: false,
    isLiking: false,
    error: null,
    pagination: { ...defaultPagination },

    fetchComments: async (complaintId, page = 0) => {
        set({ isFetching: true, error: null });
        try {
            const res = await axiosInstance.get(`/comments/complaint/${complaintId}`, {
                params: { page, size: 10, sortBy: "createdAt", sortDir: "desc" },
            });
            const data = res.data;
            set({
                comments: data.comments,
                pagination: {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalItems: data.totalItems,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious,
                },
                isFetching: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "Failed to load comments",
                isFetching: false,
            });
        }
    },

    addComment: async (complaintId, userId, text) => {
        set({ error: null, isAdding: true });
        try {
            const newComment = await axiosInstance.post("/comments/create", {
                complaintId,
                userId,
                text,
            });
            set({
                comments: [newComment.data.comment, ...get().comments],
                isAdding: false,
            })
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "Failed to add comment",
                isAdding: false,
            });
        }
    },

    deleteComment: async (commentId) => {
        set({ isDeleting: true });
        const prevComments = [...get().comments];
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            set({
                comments: get().comments.filter((c) => c.commentId !== commentId),
                isDeleting: false,
            });
        }
        catch (err: any) {
            set({ comments: prevComments, isDeleting: false });
        }
    },

    toggleLike: async (commentId, userId) => {
        set({ isLiking: true });
        const prevComments = [...get().comments];
        set({
            comments: get().comments.map((c) =>
                c.commentId === commentId
                    ? {
                        ...c,
                        isLiked: !c.isLiked,
                        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                        likedByUsers: c.isLiked
                            ? c.likedByUsers.filter((id) => id !== userId)
                            : [...c.likedByUsers, userId],
                    }
                    : c
            ),
        });
        try {
            await axiosInstance.put(`/comments/${commentId}/toggle-like?userId=${userId}`);
            set({ isLiking: false });
        } catch (err: any) {
            set({ comments: prevComments, isLiking: false });
        }
    },

    clearComments: () => set({ comments: [], pagination: { ...defaultPagination } }),
    clearError: () => set({ error: null }),
}));