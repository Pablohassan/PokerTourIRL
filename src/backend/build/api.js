"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Set up a base URL for your API requests.
// This should be the URL where your backend server is running.
// For local development, this is typically http://localhost:3000
const api = axios_1.default.create({
    baseURL: 'http://localhost:3000',
});
// api.defaults.withCredentials = true;
exports.default = api;
