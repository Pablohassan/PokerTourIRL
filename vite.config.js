"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
// Plugins
var tailwindcss_1 = require("tailwindcss");
var postcssImport = require("postcss-import");
var autoprefixer = require("autoprefixer");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    server: {
        host: '0.0.0.0', // Listen on all network interfaces
        port: 5173, // Optional: Define a specific port
    },
    assetsInclude: ['**/*.ttf'],
    plugins: [(0, plugin_react_swc_1.default)()],
    // resolve: {
    //   alias: {
    //     '@': resolve(__dirname, 'src'),
    //   },
    // },
    css: {
        postcss: {
            plugins: [
                postcssImport(),
                tailwindcss_1.default,
                autoprefixer
            ],
        },
    },
});
