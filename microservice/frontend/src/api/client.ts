import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Templates
  getTemplates: () => apiClient.get('/templates'),
  getTemplate: (id: string) => apiClient.get(`/templates/${id}`),
  createTemplate: (data: any) => apiClient.post('/templates', data),
  updateTemplate: (id: string, data: any) => apiClient.put(`/templates/${id}`, data),

  // Mail
  sendMail: (data: any) => apiClient.post('/mail/send', data),
  scheduleMail: (data: any) => apiClient.post('/mail/schedule', data),
  getScheduledMails: (userId: string) => apiClient.get(`/mail/scheduled/${userId}`),

  // Admin
  getAuditLogs: () => apiClient.get('/admin/audit'),
  getMailStats: () => apiClient.get('/admin/stats'),
  addToBlacklist: (data: any) => apiClient.post('/admin/blacklist', data),
}; 