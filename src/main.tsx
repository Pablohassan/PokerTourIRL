import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'
import './index.css'
import 'tailwindcss/tailwind.css'
import {UIProvider} from './components/UiProvider';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <Router>
  <UIProvider>

    <App />
    
    </UIProvider>
  </Router>
</React.StrictMode>,
)
