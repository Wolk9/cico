import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
 
//theme
import "./theme.css";
import "./custom.css";

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

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <div>
    <App />
  </div>
);