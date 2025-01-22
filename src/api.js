import axios from "axios";
import { API_BASE_URL, API_CONFIG } from "./config";
const api = axios.create({
    baseURL: API_BASE_URL,
    ...API_CONFIG,
});
// Add response interceptor for better error handling
api.interceptors.response.use((response) => response, (error) => {
    console.error("API Error:", error);
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
    }
    else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
    }
    else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
});
export default api;
