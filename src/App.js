import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
// import ThemeProvider from "./theme";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
