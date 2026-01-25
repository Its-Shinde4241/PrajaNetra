import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';

export const ComplaintStatus = {
    SUBMITTED: 'SUBMITTED',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
} as const;

export type ComplaintStatus = typeof ComplaintStatus[keyof typeof ComplaintStatus];

export interface Complaint {
    complaintId: string;
    userId: string;
    category: string;
    location: string;
    description: string;
    status: ComplaintStatus;
    imageUrls?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateComplaintData {
    userId: string;
    title: string;
    category: string;
    location: string;
    description: string;
    images?: File[];
}

export interface PaginatedComplaints {
    complaints: Complaint[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface ComplaintFilters {
    page?: number;
    size?: number;
    status?: ComplaintStatus;
    category?: string;
    userId?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

interface ComplaintStore {
    complaints: Complaint[];
    currentComplaint: Complaint | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
    isLoading: boolean;
    error: string | null;

    // Actions
    createComplaint: (data: CreateComplaintData) => Promise<{ message: string; complaintId: string; complaint: Complaint }>;
    getComplaint: (complaintId: string) => Promise<void>;
    getAllComplaints: (filters?: ComplaintFilters) => Promise<void>;
    updateComplaintStatus: (complaintId: string, status: ComplaintStatus) => Promise<void>;
    deleteComplaint: (complaintId: string) => Promise<void>;
    clearError: () => void;
    clearCurrentComplaint: () => void;
}

export const useComplaintStore = create<ComplaintStore>((set) => ({
    complaints: [],
    currentComplaint: null,
    pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
    },
    isLoading: false,
    error: null,

    createComplaint: async (data: CreateComplaintData) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();

            // Add complaint data as JSON string
            const complaintData = {
                userId: data.userId,
                title: data.title,
                category: data.category,
                location: data.location,
                description: data.description,
            };
            formData.append('data', JSON.stringify(complaintData));

            // Add images if provided
            if (data.images && data.images.length > 0) {
                data.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const response = await axiosInstance.post('/complaints', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            set({ isLoading: false });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create complaint';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    getComplaint: async (complaintId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/complaints/${complaintId}`);
            set({
                currentComplaint: response.data,
                isLoading: false
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch complaint';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    getAllComplaints: async (filters: ComplaintFilters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();

            if (filters.page !== undefined) params.append('page', filters.page.toString());
            if (filters.size !== undefined) params.append('size', filters.size.toString());
            if (filters.status) params.append('status', filters.status);
            if (filters.category) params.append('category', filters.category);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

            const response = await axiosInstance.get(`/complaints?${params.toString()}`);

            set({
                complaints: response.data.complaints,
                pagination: {
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalItems,
                },
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch complaints';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    updateComplaintStatus: async (complaintId: string, status: ComplaintStatus) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.patch(`/complaints/${complaintId}/status`, {
                status,
            });

            // Update the complaint in the list if it exists
            set((state) => ({
                complaints: state.complaints.map((complaint) =>
                    complaint.complaintId === complaintId
                        ? response.data.complaint
                        : complaint
                ),
                currentComplaint: state.currentComplaint?.complaintId === complaintId
                    ? response.data.complaint
                    : state.currentComplaint,
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update complaint status';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    deleteComplaint: async (complaintId: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/complaints/${complaintId}`);

            // Remove the complaint from the list
            set((state) => ({
                complaints: state.complaints.filter((complaint) => complaint.complaintId !== complaintId),
                currentComplaint: state.currentComplaint?.complaintId === complaintId
                    ? null
                    : state.currentComplaint,
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete complaint';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    clearError: () => set({ error: null }),

    clearCurrentComplaint: () => set({ currentComplaint: null }),
}));
