import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AdminProvider from "./context/AdminContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
  <UserProvider>
  <AdminProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AdminProvider>
  </UserProvider>
  </Router>
);
