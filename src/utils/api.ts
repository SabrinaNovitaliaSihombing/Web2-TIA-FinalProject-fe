import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Update this with your backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const noteApi = {
    getAllNotes: () => api.get('/notes'),
    getNoteById: (id: number) => api.get(`/notes/${id}`),
    createNote: (data: { judul: string; deskripsi: string }) => api.post('/notes', data),
    updateNote: (id: number, data: { judul: string; deskripsi: string }) => api.patch(`/notes/${id}`, data),
    deleteNote: (id: number) => api.delete(`/notes/${id}`),
};

export const taskApi = {
    getAllTasks: () => api.get('/tasks'),
    getTaskById: (id: number) => api.get(`/tasks/${id}`),
    createTask: (data: {
        judul: string;
        deskripsi?: string;
        due_date?: string;
        status?: boolean;
        id_kategori?: number | null;
    }) => {
        const processedData = {
            ...data,
            id_kategori: data.id_kategori ? Number(data.id_kategori) : null
        };
        return api.post('/tasks', processedData);
    },
    updateTask: (id: number, data: {
        judul?: string;
        deskripsi?: string;
        due_date?: string;
        status?: boolean;
        id_kategori?: number | null;
    }) => {
        const processedData = {
            ...data,
            id_kategori: data.id_kategori ? Number(data.id_kategori) : null
        };
        return api.patch(`/tasks/${id}`, processedData);
    },
    deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

export const categoryApi = {
    getAllCategories: () => api.get('/categories'),
    getCategoryById: (id: number) => api.get(`/categories/${id}`),
    createCategory: (data: { nama: string; warna?: string }) => api.post('/categories', data),
    updateCategory: (id: number, data: { nama?: string; warna?: string }) => api.patch(`/categories/${id}`, data),
    deleteCategory: (id: number) => api.delete(`/categories/${id}`),
};

// Auth endpoints without token
export const authApi = {
    login: (data: { email: string; password: string }) =>
        axios.post(`${API_URL}/auth/login`, data),
    register: (data: { email: string; password: string; username: string }) =>
        axios.post(`${API_URL}/auth/register`, data),
};

export default api; 