import axios from 'axios';

// Usar a mesma origem (localhost:3000) já que as API routes estão no Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (username: string, email: string, password: string, role?: string) => 
    api.post('/api/auth/register', { username, email, password, role }),
  
  getMe: () => 
    api.get('/api/auth/me'),
  
  logout: () => 
    api.post('/api/auth/logout'),
};

// Actions API
export const actionsAPI = {
  getAll: (filters?: any) => 
    api.get('/api/actions', { params: filters }),
  
  getById: (id: string) => 
    api.get(`/api/actions/${id}`),
  
  create: (data: any) => 
    api.post('/api/actions', data),
  
  update: (id: string, data: any) => 
    api.put(`/api/actions/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/api/actions/${id}`),
};

// Members API
export const membersAPI = {
  getAll: () => 
    api.get('/api/members'),
  
  getById: (id: string) => 
    api.get(`/api/members/${id}`),
  
  update: (id: string, data: any) => 
    api.put(`/api/members/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/api/members/${id}`),
  
  getTopRanking: (limit?: number) => 
    api.get('/api/members/ranking/top', { params: { limit } }),
};

// Statistics API
export const statisticsAPI = {
  getDashboard: () => 
    api.get('/api/statistics/dashboard'),
  
  getActionsByType: () => 
    api.get('/api/statistics/actions-by-type'),
  
  getPerformanceTimeline: (period?: string) => 
    api.get('/api/statistics/performance-timeline', { params: { period } }),
  
  getTopPerformers: () => 
    api.get('/api/statistics/top-performers'),
};
