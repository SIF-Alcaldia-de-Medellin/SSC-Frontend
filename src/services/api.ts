const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "localhost:3000";

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        const {message} = await response.json();
        throw new Error(message);
    }
    
    return response.json();
  },

  get: (endpoint: string, options?: RequestInit) => apiClient.request(endpoint, options || {}),
  post: (endpoint: string, data: unknown) => apiClient.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint: string, data: unknown) => apiClient.request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint: string) => apiClient.request(endpoint, { method: 'DELETE' }),
};