import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { setAuthToken } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const login = (token: string) => {
    if (!token || token === 'undefined' || token === 'null') {
      console.error('❌ Invalid token received:', token);
      return;
    }
    console.log('✅ login() called, setting isAuthenticated = true');
    setAuthToken(token);
    setToken(token);
    setIsAuthenticated(true); // ← this must trigger re-render in App.tsx
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // ── Mobile deep link: genai-app://login#id_token=xxx ──
    const handleUrl = (url: string) => {
      if (!url) return;
      console.log('🔗 Deep link received:', url);
      const fragmentIndex = url.indexOf('#');
      if (fragmentIndex !== -1) {
        const fragment = url.substring(fragmentIndex + 1);
        const params = new URLSearchParams(fragment);
        const token = params.get('id_token');
        if (token) login(token);
      }
    };

    Linking.getInitialURL().then((url) => { if (url) handleUrl(url); });
    const subscription = Linking.addEventListener('url', (event) => handleUrl(event.url));

    // ── Web popup postMessage ──
    const handlePostMessage = (event: MessageEvent) => {
      console.log('📨 postMessage received:', event.data);
      if (event.data?.type === 'GOOGLE_LOGIN_SUCCESS' && event.data?.token) {
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
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
