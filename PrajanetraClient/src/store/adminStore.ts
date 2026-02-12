import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';

export const ComplaintStatus = {
    SUBMITTED: 'SUBMITTED',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED',
} as const;

export type ComplaintStatus = typeof ComplaintStatus[keyof typeof ComplaintStatus];

export interface User {
    userId: string;
    email: string;
    name: string;
    profileImageUrl?: string;
    roles?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Complaint {
    complaintId: string;
    title: string;
    description: string;
    category: string;
    status: ComplaintStatus;
    createdAt: string;
    userId: string;
    userName?: string;
    imageUrls?: string[];
}

export interface DashboardStats {
    totalComplaints: number;
    submittedComplaints?: number;
    acknowledgedComplaints?: number;
    underReviewComplaints?: number;
    pendingComplaints?: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    rejectedComplaints?: number;
    totalUsers: number;
    staffMembers: number;
}

export interface CategoryStats {
    [category: string]: number;
}

export interface StatusStats {
    [status: string]: number;
}

interface AdminStore {
    // State
    users: User[];
    staffMembers: User[];
    regularUsers: User[];
    complaints: Complaint[];
    dashboardStats: DashboardStats | null;
    categoryStats: CategoryStats | null;
    statusStats: StatusStats | null;
    recentComplaints: Complaint[];
    isLoading: boolean;
    error: string | null;

    // User Management Actions
    getAllUsers: () => Promise<void>;
    getUserById: (userId: string) => Promise<User>;
    makeStaff: (userId: string) => Promise<void>;
    revokeStaffRole: (userId: string) => Promise<void>;
    getAllStaffMembers: () => Promise<void>;
    getAllRegularUsers: () => Promise<void>;

    // Complaint Management Actions
    changeComplaintStatus: (complaintId: string, status: ComplaintStatus) => Promise<void>;
    getComplaintsByStatus: (status: ComplaintStatus) => Promise<void>;
    getComplaintsByDateRange: (start: string, end: string) => Promise<void>;
    bulkUpdateStatus: (complaintIds: string[], status: ComplaintStatus) => Promise<void>;

    // Analytics & Reports Actions
    getDashboardStats: () => Promise<void>;
    getCategoryStats: () => Promise<void>;
    getStatusStats: () => Promise<void>;
    getRecentComplaints: (limit?: number) => Promise<void>;

    // Utility Actions
    clearError: () => void;
    reset: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
    // Initial State
    users: [],
    staffMembers: [],
    regularUsers: [],
    complaints: [],
    dashboardStats: null,
    categoryStats: null,
    statusStats: null,
    recentComplaints: [],
    isLoading: false,
    error: null,

    // User Management
    getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/users');
            set({ users: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch users';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getUserById: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/admin/users/${userId}`);
            set({ isLoading: false });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    makeStaff: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/admin/makestaff/${userId}`);
            set({ isLoading: false });
            // Refresh user lists
            await get().getAllUsers();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to make user staff';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    revokeStaffRole: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/admin/revokestaff/${userId}`);
            set({ isLoading: false });
            // Refresh user lists
            await get().getAllUsers();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to revoke staff role';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getAllStaffMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/users/staff');
            set({ staffMembers: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch staff members';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getAllRegularUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/users/regular');
            set({ regularUsers: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch regular users';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    // Complaint Management
    changeComplaintStatus: async (complaintId: string, status: ComplaintStatus) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put('/admin/complaints/status', {
                complaintId,
                newStatus: status,
            });
            set({ isLoading: false });
            // Refresh complaints
            await get().getRecentComplaints();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update complaint status';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getComplaintsByStatus: async (status: ComplaintStatus) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/admin/complaints/by-status/${status}`);
            set({ complaints: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch complaints';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getComplaintsByDateRange: async (start: string, end: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/complaints/date-range', {
                params: { start, end },
            });
            set({ complaints: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch complaints';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    bulkUpdateStatus: async (complaintIds: string[], status: ComplaintStatus) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put('/admin/complaints/bulk-status', {
                complaintIds,
                status,
            });
            set({ isLoading: false });
            // Refresh complaints
            await get().getRecentComplaints();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to bulk update complaints';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    // Analytics & Reports
    getDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/dashboard/stats');
            set({ dashboardStats: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard stats';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getCategoryStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/stats/categories');
            set({ categoryStats: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch category stats';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getStatusStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/stats/status');
            set({ statusStats: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch status stats';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getRecentComplaints: async (limit: number = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/complaints/recent', {
                params: { limit },
            });
            set({ recentComplaints: response.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch recent complaints';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    // Utility
    clearError: () => set({ error: null }),

    reset: () => set({
        users: [],
        staffMembers: [],
        regularUsers: [],
        complaints: [],
        dashboardStats: null,
        categoryStats: null,
        statusStats: null,
        recentComplaints: [],
        isLoading: false,
        error: null,
    }),
}));
