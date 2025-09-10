import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('farmaris_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('farmaris_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Handle automatic redirects based on auth state and current location
  useEffect(() => {
    if (!isLoading) {
      if (user && location.pathname === '/') {
        // If user is logged in and on homepage, redirect to dashboard
        navigate('/admin');
      } else if (!user && location.pathname === '/admin') {
        // If user is not logged in and trying to access admin, redirect to home
        navigate('/');
      }
    }
  }, [user, location.pathname, isLoading, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simple authentication check
      if (email === 'admin@farmaris.com' && password === 'farmaris2025') {
        const adminUser: User = {
          id: 'admin-001',
          email: 'admin@farmaris.com',
          role: 'admin',
          fullName: 'Farm Aris Admin'
        };
        setUser(adminUser);
        localStorage.setItem('farmaris_user', JSON.stringify(adminUser));
        // Redirect to dashboard after successful login
        navigate('/admin');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmaris_user');
    // Redirect to landing page after logout
    navigate('/');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};