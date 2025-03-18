
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wrap the rendering in a try-catch to prevent white screen of death
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found!");
    document.body.innerHTML = '<div style="text-align: center; padding: 20px;">Failed to initialize application. Root element not found.</div>';
  } else {
    createRoot(rootElement).render(<App />);
  }
} catch (error) {
  console.error("Failed to render application:", error);
  document.body.innerHTML = '<div style="text-align: center; padding: 20px;">Failed to initialize application. Please check console for details.</div>';
}
