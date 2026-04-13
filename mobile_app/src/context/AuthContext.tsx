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
      
      // Manual parsing for fragments, as ParsedURL might not expose it directly in all versions
      const fragmentIndex = url.indexOf('#');
      if (fragmentIndex !== -1) {
        const fragment = url.substring(fragmentIndex + 1);
        const params = new URLSearchParams(fragment);
        const token = params.get('id_token');
        if (token) {
          console.log('Detected token from link');
          login(token);
        }
      }
    };

    // Handle initial URL if app was opened via link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Web-specific: Check for token in URL fragment on initial load
    if (typeof window !== 'undefined' && window.location.hash) {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const token = params.get('id_token');
      if (token) {
        console.log('Detected token from Web fragment');
        login(token);
        // Clear the fragment from the URL for security/cleanliness
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Listen for incoming URLs while app is open
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
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
