import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { setAuthToken } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  // Listen for deep links (like genai-app://login#id_token=...)
  useEffect(() => {
    const handleUrl = (url: string) => {
      if (!url) return;
      const fragmentIndex = url.indexOf('#');
      if (fragmentIndex !== -1) {
        const fragment = url.substring(fragmentIndex + 1);
        const params = new URLSearchParams(fragment);
        const token = params.get('id_token');
        if (token) {
          login(token);
        }
      }
    };

    // Mobile: Handle deep links
    Linking.getInitialURL().then((url) => { if (url) handleUrl(url); });
    const subscription = Linking.addEventListener('url', (event) => handleUrl(event.url));

    // Web: Listen for postMessage from the Google login popup
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_LOGIN_SUCCESS' && event.data?.token) {
        console.log('Received token from popup');
        login(event.data.token);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handlePostMessage);
    }

    return () => {
      subscription.remove();
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handlePostMessage);
      }
    };
  }, []);



  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
