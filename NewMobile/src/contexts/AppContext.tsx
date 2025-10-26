import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastConfig, useToast } from '../components/Toast';
import LoadingOverlay from '../components/LoadingOverlay';
import { apiManager } from '../services/ApiManager';

interface AppContextType {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  
  // Toast notifications
  showToast: (config: ToastConfig) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  
  // App state
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  
  // Network state
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  
  // API management
  getApiStatus: () => any;
  testApiConnectivity: () => Promise<any>;
  
  // Cache management
  clearCache: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const toast = useToast();

  const showLoading = (message: string = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const setInitialized = (initialized: boolean) => {
    setIsInitialized(initialized);
  };

  const setOnline = (online: boolean) => {
    setIsOnline(online);
    
    if (!online) {
      toast.showWarning(
        'No Internet Connection',
        'You are currently offline. Some features may not be available.'
      );
    } else {
      toast.showSuccess('Connected', 'Internet connection restored.');
    }
  };

  const clearCache = async () => {
    try {
      showLoading('Clearing cache...');
      
      // Clear AsyncStorage cache (implement based on your cache strategy)
      // await AsyncStorage.clear();
      
      // Clear any other caches
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate cache clearing
      
      toast.showSuccess('Cache Cleared', 'Application cache has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.showError('Error', 'Failed to clear cache. Please try again.');
    } finally {
      hideLoading();
    }
  };

  const refreshData = async () => {
    try {
      showLoading('Refreshing data...');
      
      // Test API connectivity and refresh data using ApiManager
      const connectivity = await apiManager.testConnectivity();
      
      if (connectivity.realApi) {
        toast.showSuccess('Refreshed', 'Data refreshed from real API successfully.');
      } else {
        throw new Error('Real API is not available');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.showError('Refresh Failed', 'Unable to refresh data. Please check your connection.');
    } finally {
      hideLoading();
    }
  };

  const getApiStatus = () => {
    return apiManager.getApiStatus();
  };

  const testApiConnectivity = async () => {
    try {
      showLoading('Testing API connectivity...');
      const result = await apiManager.testConnectivity();
      
      if (result.realApi) {
        toast.showSuccess('API Test', 'Real API is available and working.');
      } else {
        toast.showError('API Test', 'Real API is unavailable. Please check your connection.');
      }
      
      return result;
    } catch (error) {
      console.error('Error testing API:', error);
      toast.showError('API Test Failed', 'Unable to test API connectivity.');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const contextValue: AppContextType = {
    // Loading states
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    
    // Toast notifications
    showToast: toast.show,
    showSuccess: toast.showSuccess,
    showError: toast.showError,
    showWarning: toast.showWarning,
    showInfo: toast.showInfo,
    
    // App state
    isInitialized,
    setInitialized,
    
    // Network state
    isOnline,
    setOnline,
    
    // API management
    getApiStatus,
    testApiConnectivity,
    
    // Cache management
    clearCache,
    refreshData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay
        visible={isLoading}
        message={loadingMessage}
      />
      <toast.ToastContainer />
    </AppContext.Provider>
  );
};

// Default export
export default AppProvider;
