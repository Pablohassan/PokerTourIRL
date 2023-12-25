import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Listen on all network interfaces
        port: 5173, // Optional: Define a specific port
    },
    assetsInclude: ['**/*.ttf'],
    plugins: [react()],
    css: {
        postcss: {
            plugins: [
                postcssImport(),
                tailwindcss,
                autoprefixer
            ],
        },
    },
});
