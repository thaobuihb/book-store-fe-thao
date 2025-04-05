import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <PayPalScriptProvider
            options={{
              "client-id": "AQzOIzWN_xafoh5QS9vP9oQ5HRNFoMzY74UaCdKUkIWh07LATtwOGHdYHi5w6EHSatsbeQpyyB8KVmG-", 
              currency: "USD",
            }}
          >
            <Router />
            <ToastContainer position="top-right" autoClose={1000} />
          </PayPalScriptProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
