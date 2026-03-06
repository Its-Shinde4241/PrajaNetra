import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance, setAuthToken } from '@/lib/axios';

interface User {
    userId: string;
    email: string;
    name: string;
    profileImageUrl?: string;
    googleId?: string;
    loginMethod?: string;
    createdAt: string;
    updatedAt: string;
    roles?: string[];
    complaints?: string[];
    resolvedComplaints?: number;
}

interface AuthResponse {
    token: string;
    user: User;
    message: string;
}

interface UserStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    loginWithGoogle: () => void;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User, token: string) => void;
    validateToken: () => Promise<void>;
    updateProfile: (name: string, profileImageUrl?: File) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
                        email,
                        password,
                    });

                    const data = response.data;

                    // Set token in axios instance
                    setAuthToken(data.token);

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axiosInstance.post<AuthResponse>('/auth/register', {
                        name,
                        email,
                        password,
                    });

                    const data = response.data;

                    // Set token in axios instance
                    setAuthToken(data.token);

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Registration failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            loginWithGoogle: () => {
                // Redirect to Google OAuth endpoint
                window.location.href = 'http://localhost:8080/api/auth/google/login';
            },

            logout: () => {
                // Clear token from axios instance
                setAuthToken(null);

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            setUser: (user: User, token: string) => {
                // Set token in axios instance
                setAuthToken(token);

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    error: null,
                });
            },
            validateToken: async () => {
                const { token } = get();

                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    // Set token before making request
                    setAuthToken(token);

                    const response = await axiosInstance.get<{ user: User }>('/auth/me');

                    set({
                        user: response.data.user,
                        isAuthenticated: true,
                        error: null,
                    });
                } catch (error: any) {
                    // Token is invalid/expired - clear everything
                    setAuthToken(null);
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            },
            updateProfile: async (name: string, profileImage?: File) => {
                const { user, token } = get();
                if (!token || !user) {
                    throw new Error('User not authenticated');
                }
                try {
                    const formData = new FormData();

                    if (name && name !== user.name) {
                        formData.append('name', name);
                    }

                    if (profileImage) {
                        formData.append('profileImage', profileImage);
                    }

                    const response = await axiosInstance.put<{ message: string; user: User }>(
                        '/auth/user/update',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    // Update state directly - no need to return
                    set({ user: response.data.user });

                } catch (error: any) {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Profile update failed';
                    throw new Error(errorMessage);
                }
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
