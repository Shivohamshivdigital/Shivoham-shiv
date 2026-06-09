import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Legacy support: redirect old hash-router links (e.g. /#/treatments) to the
// equivalent clean URL (/treatments) so existing bookmarks keep working.
if (window.location.hash.startsWith('#/')) {
  const cleanPath = window.location.hash.slice(1) + window.location.search;
  window.history.replaceState(null, '', cleanPath);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
