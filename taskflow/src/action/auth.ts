// @/action/useApiRequest.ts
import { useAuth } from '@clerk/clerk-react';

export const useApiRequest = () => {
  const { getToken } = useAuth();

  const apiRequest = async (endpoint: string, data: any = {}, method = 'POST') => {
    const token = await getToken();

    const isFormData = data instanceof FormData;

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Authorization': `Bearer ${token}`,
      },
      body: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });

    const contentType = response.headers.get('Content-Type');
    
    let result: any = null;
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }

    if (!response.ok) {
      throw new Error(result?.message || 'Request failed');
    }

    return result;
  };

  return { apiRequest };
};
