import React from "react";
import BotResponse from "./BotResponse";
import { FileIcon } from "lucide-react";

const MessageItem = ({ msg }) => {
   if (msg.sender === "user") {
      return (
         <div className="message user-message">
            {msg.type ? (
               <div className="userIcon-file-preview">
                  <div className="userIcon file-icon">
                     <FileIcon />
                  </div>
                  <div className="file-info">
                     <div className="file-name">{msg.text}</div>
                  </div>
               </div>
            ) : (
               <div>{msg.text}</div>
            )}
         </div>
      );
   }

   return (
      <div className="message bot-message">
         <BotResponse textObj={msg.text} />
      </div>
   );
};

export default MessageItem;
