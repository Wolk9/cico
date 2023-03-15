import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
 
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

//primeflex
import "/node_modules/primeflex/primeflex.css";    

        
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter } from "react-router-dom";


  
  const rootElement = document.getElementById('root');
  
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );