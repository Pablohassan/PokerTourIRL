import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(NextUIProvider, { children: _jsx(Router, { children: _jsx(App, {}) }) }) }));
//# sourceMappingURL=main.js.map