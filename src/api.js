import axios from 'axios';
// Set up a base URL for your API requests.
// This should be the URL where your backend server is running.
// For local development, this is typically http://localhost:3000
const api = axios.create({
    baseURL: 'https://api.bourlypokertour.fr'
});
// api.defaults.withCredentials = true;
export default api;
