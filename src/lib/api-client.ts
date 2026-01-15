import { useAuthStore } from '~/stores/auth-store';
import { useApiStore } from '~/stores/api-store';

export type ApiClientOptions = {
  headers?: Record<string, string>;
  endpoint?: 'staff' | 'agent';
};

export const createApiClient = () => {
  const getBaseUrl = () => {
    const { baseUrl, staffEndpoint, agentEndpoint } = useApiStore.getState();
    const { isStaff } = useAuthStore.getState();
    
    return `${baseUrl}${isStaff ? staffEndpoint : agentEndpoint}`;
  };
  
  const getHeaders = (customHeaders: Record<string, string> = {}) => {
    const { token } = useAuthStore.getState();
    
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
  };
  
  return {
    get: async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
      const { headers = {} } = options;
      const baseUrl = getBaseUrl();
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: getHeaders(headers),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response.json();
    },
    
    post: async <T>(path: string, data: any, options: ApiClientOptions = {}): Promise<T> => {
      const { headers = {} } = options;
      const baseUrl = getBaseUrl();
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: getHeaders(headers),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response.json();
    },
    
    put: async <T>(path: string, data: any, options: ApiClientOptions = {}): Promise<T> => {
      const { headers = {} } = options;
      const baseUrl = getBaseUrl();
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'PUT',
        headers: getHeaders(headers),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response.json();
    },
    
    delete: async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
      const { headers = {} } = options;
      const baseUrl = getBaseUrl();
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'DELETE',
        headers: getHeaders(headers),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response.json();
    },
  };
};

export const apiClient = createApiClient();