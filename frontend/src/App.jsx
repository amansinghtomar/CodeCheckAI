import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./pages/Navbar/Header";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";

const ProtectedRoute = ({ children }) => {
   const { user } = useAuth();
   return user ? children : <Navigate to="/login" />;
};

function App() {
   return (
      <Router>
         <div className="app-container">
            <Header />
            <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<SignUp />} />
               <Route
                  path="/"
                  element={
                     <div className="main-content">
                        <ProtectedRoute>
                           <Dashboard />
                        </ProtectedRoute>
                     </div>
                  }
               />
               <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
         </div>
      </Router>
   );
}

export default App;
