/**
 * Centralized API client for all HTTP requests
 * Provides base configuration, error handling, and common request methods
 */

import { apiLogger } from '@/utils/apiLogger';
import { handleAuthError, isAuthError } from '@/utils/authErrorHandler';

// Configuration
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const defaultUrl = 'https://grh.sa/api';
  // const defaultUrl = 'http://54.160.175.61:2701';
  // const defaultUrl = 'https://iskan.thinkstudio.ai/api';

  // Force the correct URL for production
  if (envUrl && (envUrl.includes('172.104.226.120:2701') || envUrl.startsWith('http://'))) {
    console.warn('⚠️ Old/HTTP API URL detected, forcing HTTPS URL');
    return defaultUrl;
  }

  return envUrl || defaultUrl;
};

const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
};

// Log the API configuration for debugging
console.log('🔧 API Configuration:', {
  baseURL: API_CONFIG.baseURL,
  envUrl: import.meta.env.VITE_API_BASE_URL,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  allEnvVars: {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
  }
});

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic request wrapper with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const method = options.method || 'GET';

  // For FormData, we need to exclude Content-Type to let browser set multipart boundary
  const isFormData = options.body instanceof FormData;
  
  // Build headers - exclude Content-Type for FormData
  const defaultHeaders = { ...API_CONFIG.headers };
  if (isFormData) {
    delete defaultHeaders['Content-Type'];
  }
  
  // Merge with options headers, but exclude Content-Type if it's undefined or if it's FormData
  const mergedHeaders: Record<string, string> = { ...defaultHeaders };
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (key === 'Content-Type' && (isFormData || value === undefined)) {
        // Don't include Content-Type for FormData or if explicitly undefined
        return;
      }
      if (value !== undefined) {
        mergedHeaders[key] = String(value);
      }
    });
  }

  const config: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Log request
  apiLogger.logRequest({
    method,
    url,
    endpoint,
    headers: config.headers as Record<string, string>,
    requestData: options.body,
    timestamp: new Date().toISOString(),
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response body
    let data: any;
    const contentType = response.headers.get('content-type');

    // Handle 204 No Content responses (common for DELETE operations)
    if (response.status === 204) {
      data = null;
    } else if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log response
    apiLogger.logResponse({
      method,
      url,
      endpoint,
      headers: Object.fromEntries(response.headers.entries()),
      responseData: data,
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const apiError = new ApiError(
        // data?.message || `HTTP Error: ${response.status}`,
        data?.detail || `HTTP Error: ${response.status}`,
        response.status,
        data
      );

      // Handle authentication errors (401, 403) - automatically logout
      if (isAuthError(response.status)) {
        handleAuthError(response.status, data?.message);
        // Still throw the error for proper error handling in components
        throw apiError;
      }

      // Log error
      apiLogger.logError({
        method,
        url,
        endpoint,
        headers: Object.fromEntries(response.headers.entries()),
        requestData: options.body,
        error: apiError,
        timestamp: new Date().toISOString(),
      });

      throw apiError;
    }

    return data;
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof ApiError) {
      // Log error (already logged above for HTTP errors)
      if (error.status === 0 || error.status >= 500) {
        apiLogger.logError({
          method,
          url,
          endpoint,
          headers: config.headers as Record<string, string>,
          requestData: options.body,
          error,
          timestamp: new Date().toISOString(),
        });
      }
      throw error;
    }

    let apiError: ApiError;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        apiError = new ApiError('Request timeout', 408);
      } else {
        apiError = new ApiError(`Network Error: ${error.message}`, 0);
      }
    } else {
      apiError = new ApiError('Unknown error occurred', 500);
    }

    // Log error
    apiLogger.logError({
      method,
      url,
      endpoint,
      headers: config.headers as Record<string, string>,
      requestData: options.body,
      error: apiError,
      timestamp: new Date().toISOString(),
    });

    throw apiError;
  }
}

// HTTP Methods
export const api = {
  // GET request
  get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }
    const currentLanguage =
        typeof window !== 'undefined'
            ? localStorage.getItem('housing_language') || 'ar'
            : 'ar';
    return request<T>(url, {
      method: 'GET',
      headers: {
        'Accept-Language': currentLanguage,
      },
    });
  },

  // POST request
  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT request
  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PATCH request
  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE request
  delete: <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, {
      method: 'DELETE',
    });
  },

  // File upload
  upload: <T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    // Request function will automatically detect FormData and exclude Content-Type
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};

// Export the request function for custom use cases
export { request };
