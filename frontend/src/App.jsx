import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./pages/Dashboard/Sidebar";
import ChatArea from "./pages/Dashboard/ChatArea";
import Header from "./pages/Navbar/Header";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
   const { user } = useAuth();
   return user ? children : <Navigate to="/login" />;
};

function App() {
   const [chats, setChats] = useState([]);
   const [currentChatKey, setCurrentChatKey] = useState(Date.now());

   const addChatToSidebar = (title) => {
      setChats([...chats, { id: chats.length + 1, title }]);
   };

   const startNewChat = () => {
      setCurrentChatKey(Date.now());
   };

   return (
      <Router>
         <div className="app-container">
            <Header />
            <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<SignUp />} />
               <Route
                  path="/home"
                  element={
                     <div className="main-content">
                        <ProtectedRoute>
                           <Sidebar chats={chats} onChatSelect={() => {}} startNewChat={startNewChat} />
                        </ProtectedRoute>
                        <ProtectedRoute>
                           <ChatArea key={currentChatKey} addChatToSidebar={addChatToSidebar} />
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
