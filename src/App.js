import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <Router />
          <ToastContainer position="top-right" autoClose={1000} />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
