import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '../dist/output.css';
import UIProvider from './components/UiProvider';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(Router, { children: _jsx(UIProvider, { children: _jsx(App, {}) }) }) }));
//# sourceMappingURL=main.js.map