import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactGA from "react-ga4";

// Initialize GA4 with a dummy measurement ID
ReactGA.initialize("G-XXXXXXXXXX");
// Track initial page load
ReactGA.send({ hitType: "pageview", page: "/webinar", title: "Webinar Landing Page" });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
