import axios from "axios";
import { API_BASE_URL, API_CONFIG } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  ...API_CONFIG,
});

// Function to get token from Clerk
const getClerkToken = async () => {
  try {
    // Access Clerk through the global window object
    if (typeof window !== "undefined" && (window as any).Clerk) {
      const clerk = (window as any).Clerk;
      if (clerk.session) {
        return await clerk.session.getToken();
      }
    }
  } catch (error) {
    console.error("Error getting Clerk token:", error);
  }
  return null;
};

// Add request interceptor to include authentication token
api.interceptors.request.use(
  async (config) => {
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle auth errors specifically
    if (error.response?.status === 401) {
      console.error("Auth token expired or invalid - attempting session refresh");
      
      // Try to refresh the session
      if (typeof window !== "undefined" && (window as any).Clerk) {
        const clerk = (window as any).Clerk;
        try {
          // Touch session to refresh it
          if (clerk.session?.touch) {
            await clerk.session.touch();
          }
          // Mark error for potential retry by caller
          error.isAuthError = true;
          error.message = "Session expirée - veuillez rafraîchir la page si le problème persiste";
        } catch (refreshError) {
          console.error("Failed to refresh session:", refreshError);
          // If refresh fails, user needs to re-authenticate
          error.message = "Session invalide - veuillez vous reconnecter";
        }
      }
    }
    
    // Handle network errors
    if (!error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
      error.isNetworkError = true;
      error.message = "Erreur réseau - vérifiez votre connexion";
      console.error("Network error:", error.code);
    }
    
    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      error.isServerError = true;
      error.message = "Erreur serveur - réessayez dans quelques instants";
      console.error("Server error:", error.response.status);
    }

    // Standard logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
