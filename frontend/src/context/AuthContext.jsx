import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount via /api/auth/me
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getMe();
      if (res && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (usernameOrEmail, password) => {
    const res = await authService.login(usernameOrEmail, password);
    if (res && res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error('Authentication failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER' || user?.role === 'ADMIN',
    isSalesExecutive: user?.role === 'SALES_EXECUTIVE',
    login,
    logout,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
