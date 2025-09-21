// hooks/useAdminAuth.ts
"use client";
import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api.service';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in as admin
  useEffect(() => {
    checkAdminAuth();
  }, []);
  
  const checkAdminAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminToken');
      const userData = sessionStorage.getItem('adminUser');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAdminToken(token);
          setAdminUser(user);
          setIsAdmin(true);
        } catch (err) {
          console.error('Error parsing admin user data:', err);
          logoutAdmin();
        }
      }
    }
  }, []);
  
  const loginAsAdmin = useCallback(async (credentials: AdminCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.adminLogin(credentials);
      const { token, user } = response;
      
      // Store in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('adminUser', JSON.stringify(user));
      }
      
      setAdminToken(token);
      setAdminUser(user);
      setIsAdmin(true);
      
      return { token, user };
    } catch (err: any) {
      setError(err.message || 'Failed to login as admin');
      console.error('Error logging in as admin:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logoutAdmin = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
    }
    
    setAdminToken(null);
    setAdminUser(null);
    setIsAdmin(false);
    setError(null);
  }, []);
  
  const getAdminToken = useCallback(() => {
    return adminToken || (typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null);
  }, [adminToken]);
  
  const hasPermission = useCallback((permission: string) => {
    if (!adminUser) return false;
    
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true;
    
    // Check specific permission
    return adminUser.permissions.includes(permission);
  }, [adminUser]);
  
  const hasRole = useCallback((role: string) => {
    if (!adminUser) return false;
    return adminUser.role === role;
  }, [adminUser]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Auto-logout on token expiry (basic implementation)
  useEffect(() => {
    const checkTokenValidity = () => {
      if (adminToken && typeof window !== 'undefined') {
        try {
          // Basic token validation - in real app, you'd decode JWT and check expiry
          const tokenData = JSON.parse(atob(adminToken.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenData.exp && tokenData.exp < currentTime) {
            logoutAdmin();
          }
        } catch (err) {
          // Invalid token format, logout
          logoutAdmin();
        }
      }
    };
    
    const interval = setInterval(checkTokenValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [adminToken, logoutAdmin]);
  
  return {
    // State
    isAdmin,
    adminUser,
    adminToken,
    isLoading,
    error,
    
    // Actions
    loginAsAdmin,
    logoutAdmin,
    getAdminToken,
    hasPermission,
    hasRole,
    clearError,
    checkAdminAuth
  };
};
