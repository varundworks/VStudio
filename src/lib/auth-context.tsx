'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
  canAccessVSSTemplates: boolean;
  allowedTemplates?: string[]; // Specific templates this user can access
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hard-coded users
const USERS = {
  'vsselectricals@vstudio.com': {
    password: 'vss1234',
    name: 'VSS Electricals',
    canAccessVSSTemplates: true,
    allowedTemplates: ['vss', 'cvs'],
  },
  'svelectricals001@vstudio.com': {
    password: 'sv1234',
    name: 'SV Electricals',
    canAccessVSSTemplates: false,
    allowedTemplates: ['sv'],
  },
  'gtechcarcare001@vstudio.com': {
    password: 'mani1234',
    name: 'G-Tech Car Care',
    canAccessVSSTemplates: false,
    allowedTemplates: ['gtech'],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('current-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const userConfig = USERS[email.toLowerCase() as keyof typeof USERS];
    
    if (userConfig && userConfig.password === password) {
      const userData: User = {
        email: email.toLowerCase(),
        name: userConfig.name,
        canAccessVSSTemplates: userConfig.canAccessVSSTemplates,
        allowedTemplates: userConfig.allowedTemplates,
      };
      setUser(userData);
      localStorage.setItem('current-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current-user');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
