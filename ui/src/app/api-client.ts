import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API response interface
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * API error interface
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: Record<string, unknown>;
}

/**
 * Creates and configures the API client
 */
const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  });

  // Request interceptor for adding auth token
  apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response interceptor for error handling
  apiClient.interceptors.response.use(
    (response: AxiosRequestConfig) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: error.message || 'An unknown error occurred',
      };

      if (error.response) {
        apiError.status = error.response.status;
        apiError.data = error.response.data;
        
        // Handle authentication errors
        if (error.response.status === 401 && typeof window !== 'undefined') {
          // Clear auth data and redirect to login
          localStorage.removeItem('auth_token');
          // Use location directly to avoid imports from next/navigation in a shared file
          window.location.href = '/login';
        }
      }

      return Promise.reject(apiError);
    }
  );

  return apiClient;
};

const apiClient = createApiClient();

/**
 * Helper methods for API requests
 */
export const api = {
  /**
   * Send a GET request
   */
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get(url, config);
  },

  /**
   * Send a POST request
   */
  post: <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post(url, data, config);
  },

  /**
   * Send a PUT request
   */
  put: <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put(url, data, config);
  },

  /**
   * Send a PATCH request
   */
  patch: <T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.patch(url, data, config);
  },

  /**
   * Send a DELETE request
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete(url, config);
  },
};

// Export the instance for direct usage when needed
export default apiClient;