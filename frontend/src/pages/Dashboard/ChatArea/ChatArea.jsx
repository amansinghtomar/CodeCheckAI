import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageItem from "./MessageItem";
import FilePreview from "./FilePreview";
import TypingIndicator from "./TypingIndicator";
import "./ChatArea.css";

const ChatArea = () => {
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState("");
   const [chatTitle, setChatTitle] = useState("");
   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const bottomRef = useRef(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!message.trim() && !file) return;

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (message.trim()) formData.append("text", message);
      const customCriteria = JSON.parse(localStorage.getItem("criteria"));
      if (Object.keys(customCriteria).length > 0) formData.append("criteria", JSON.stringify(customCriteria));
      const userMessage = { sender: "user", text: message || file.name, type: file?.type || "" };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
         console.log(formData);
         if (message) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/review-pr`, { prUrl: message });
         } else {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/review`, formData);
            const botResponse = { sender: "bot", text: data.review || "No response received." };
            setMessages((prev) => [...prev, botResponse]);
         }

         if (!chatTitle) setChatTitle(message || file.name);
      } catch (err) {
         setError("Error processing request. Please try again.", err);
         console.log(err);
      } finally {
         setLoading(false);
         setMessage("");
         setFile(null);
      }
   };

   return (
      <div className="chat-area">
         <div className="messages-container">
            {messages.map((msg, index) => (
               <MessageItem key={index} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            {error && <div className="error-text">{error}</div>}
            <div ref={bottomRef} />
         </div>

         <form className="input-container" onSubmit={handleSubmit}>
            <input type="file" id="fileUpload" hidden onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="fileUpload" className="upload-btn">
               📎
            </label>

            <div className="input-box-with-preview">
               {file ? (
                  <FilePreview file={file} onRemove={() => setFile(null)} />
               ) : (
                  <input
                     type="text"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Review your code..."
                     className="message-input"
                  />
               )}
            </div>
            <button type="submit" className="send-btn">
               ➤
            </button>
         </form>
      </div>
   );
};

export default ChatArea;
