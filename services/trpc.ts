import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppRouter } from '../types/trpc';

// Update this to your backend URL
const API_BASE_URL = 'https://3000-iq33rt7vhyykz7thscpau-0526df27.manusvm.computer/api/trpc';

// Create tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_BASE_URL,
      async headers() {
        const token = await AsyncStorage.getItem('auth_token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

// Helper function to handle tRPC errors
export const handleTRPCError = (error: any) => {
  if (error?.data?.code === 'UNAUTHORIZED') {
    // Clear auth data and redirect to login
    AsyncStorage.multiRemove(['auth_token', 'user_data']);
    return 'Unauthorized. Please login again.';
  }
  
  return error?.message || 'An error occurred';
};

export default trpc;
