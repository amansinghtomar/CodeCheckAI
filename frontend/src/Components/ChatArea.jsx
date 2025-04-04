import React, { useState } from "react";
import "./ChatArea.css";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatArea = ({ addChatToSidebar }) => {
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState("");
   const [chatTitle, setChatTitle] = useState("");
   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!message.trim() && !file) return;

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (message.trim()) formData.append("text", message);

      setLoading(true);
      setError(null);

      try {
         const response = await axios.post("http://localhost:3001/review", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         const botResponse = response.data.review || "No response received.";
         setMessages([...messages, { sender: "user", text: message || file.name }, { sender: "bot", text: botResponse }]);
         if (!chatTitle) {
            setChatTitle(message || file.name);
         }
      } catch (err) {
         setError("Error processing request. Please try again.");
      } finally {
         setLoading(false);
         setMessage("");
         setFile(null);
      }
   };

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) setFile(selectedFile);
   };

   return (
      <div className="chat-area">
         {/*<div className="chat-header">{chatTitle || "New Chat"}</div>*/}
         <div className="messages-container">
            {messages.map((msg, index) => (
               <div key={index} className={`message ${msg.sender}-message`}>
                  {msg.fileURL && msg.fileType.startsWith("image/") ? (
                     <img src={msg.fileURL} alt="Uploaded" className="uploaded-image" />
                  ) : (
                     <SyntaxHighlighter language="javascript" style={darcula}>
                        {msg.text}
                     </SyntaxHighlighter>
                  )}{" "}
               </div>
            ))}
         </div>

         {/* The input-container has the first input as file upload which does not actually 
 upload the file but displays the file name in the chat. Use Multer to upload the file*/}
         <form className="input-container" onSubmit={handleSubmit}>
            <input type="file" id="fileUpload" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="fileUpload" className="upload-btn">
               📎
            </label>

            <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Review your code..."
               className="message-input"
            />
            <button type="submit" className="send-btn">
               ➤
            </button>
         </form>
      </div>
   );
};

export default ChatArea;
