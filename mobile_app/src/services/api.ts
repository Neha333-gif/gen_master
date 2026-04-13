import axios from 'axios';

const API_BASE = 'https://genai-backend-m0e0.onrender.com';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authService = {
  guestLogin: async () => {
    const response = await api.post('/api/guest-login');
    return response.data;
  },
  
  googleLoginTrigger: (platform: string = 'mobile') => {
    return `https://genai-backend-m0e0.onrender.com/api/auth-trigger?platform=${platform}`;
  }
};

export const codeService = {
  execute: async (code: string) => {
    const response = await api.post('/execute', { code });
    return response.data;
  }
};
