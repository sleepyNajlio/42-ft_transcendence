import React from 'react'
import ReactDOM from 'react-dom/client'
import  App  from "./App";
import './styles/css/index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserProvider.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
