import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import BaseApi from '../api/BaseApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // Load data from encrypted storage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      setIsLoading(true);
      const storedToken = await EncryptedStorage.getItem('auth_token');
      const storedUserData = await EncryptedStorage.getItem('user_data');

      if (storedToken && storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setToken(storedToken);
        setUserData(parsedUserData);
        setCompanyId(parsedUserData.user.company_id || null);
        setIsAuthenticated(true);

        // Fetch company data after setting state
        if (parsedUserData.user.company_id) {
          try {
            const res = await BaseApi.get(
              `/companies/${parsedUserData.user.company_id}`,
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                  'Content-Type': 'application/json',
                },
              },
            );
            setCompanyData(res.data.data);
          } catch (error) {
            console.error('Error fetching company data:', error);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthData = async (authToken, user) => {
    try {
      await EncryptedStorage.setItem('auth_token', authToken);
      if (user) {
        await EncryptedStorage.setItem('user_data', JSON.stringify(user));
      }

      setToken(authToken);
      setCompanyId(user?.id_company || null);
      setUserData(user);
      setIsAuthenticated(true);

      // Fetch company data after login
      if (user?.id_company) {
        try {
          const res = await BaseApi.get(`/companies/${user.id_company}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
          setCompanyData(res.data.data);
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving auth data:', error);
      return false;
    }
  };

  const clearAuthData = async () => {
    try {
      await EncryptedStorage.removeItem('auth_token');
      await EncryptedStorage.removeItem('user_data');

      setToken(null);
      setCompanyId(null);
      setUserData(null);
      setCompanyData(null);
      setIsAuthenticated(false);

      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  };

  const updateToken = async newToken => {
    try {
      await EncryptedStorage.setItem('auth_token', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('Error updating token:', error);
      return false;
    }
  };

  const updateUserData = async newUserData => {
    try {
      await EncryptedStorage.setItem('user_data', JSON.stringify(newUserData));
      setUserData(newUserData);
      setCompanyId(newUserData?.id_company || null);
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  };

  // Helper function to get auth headers for API calls
  const getAuthHeaders = () => {
    if (!token) {
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Helper function to get API config with auth
  const getApiConfig = (additionalConfig = {}) => {
    return {
      headers: {
        ...getAuthHeaders(),
        ...additionalConfig.headers,
      },
      ...additionalConfig,
    };
  };
  const value = {
    isLoading,
    isAuthenticated,
    token,
    companyId,
    userData,
    companyData,
    saveAuthData,
    clearAuthData,
    updateToken,
    updateUserData,
    loadStoredData,
    getAuthHeaders,
    getApiConfig,
    getApiConfig,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
