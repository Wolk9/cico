import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
 
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";                                         
        


  
  const rootElement = document.getElementById('root');
  
  createRoot(rootElement).render(
    <div>
      <App />
    </div>
  );