const config = {
    API_BASE_URL: import.meta.env.PROD
        ? 'https://api.bourlypokertour.fr'
        : 'http://localhost:3000',
    WEBSITE_URL: import.meta.env.PROD
        ? 'https://bourlypokertour.fr'
        : 'http://localhost:5173'
};
export default config;
