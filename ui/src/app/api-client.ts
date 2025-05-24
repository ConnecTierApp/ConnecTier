import axios from 'axios';

/**
 * Basic API client for making requests to the backend
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: this ensures cookies are sent with requests
  withCredentials: true,
});

/**
 * Helper methods for API requests
 */
export const api = {
  get: (url: string, config = {}) => apiClient.get(url, config),
  post: (url: string, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url: string, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url: string, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url: string, config = {}) => apiClient.delete(url, config),
};

export default apiClient;