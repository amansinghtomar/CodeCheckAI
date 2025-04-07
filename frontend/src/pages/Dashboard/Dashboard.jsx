import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea/ChatArea";

function Dashboard() {
   const [chats, setChats] = useState([]);
   const [currentChatKey, setCurrentChatKey] = useState(Date.now());

   const addChatToSidebar = (title) => {
      setChats([...chats, { id: chats.length + 1, title }]);
   };

   const startNewChat = () => {
      setCurrentChatKey(Date.now());
   };

   return (
      <>
         <Sidebar chats={chats} onChatSelect={() => {}} startNewChat={startNewChat} />
         <ChatArea key={currentChatKey} addChatToSidebar={addChatToSidebar} />
      </>
   );
}

export default Dashboard;
