import axios from 'axios';
// Set up a base URL for your API requests.
// This should be the URL where your backend server is running.
// For local development, this is typically http://localhost:3000
const api = axios.create({
    baseURL: 'http://192.168.0.24:3000',
});
// api.defaults.withCredentials = true;
export default api;
//# sourceMappingURL=api.js.map