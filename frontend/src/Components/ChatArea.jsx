import React, { useState, useRef, useEffect } from "react";
import "./ChatArea.css";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileIcon, X } from "lucide-react";
import TypingText from "./TypingText";

const ChatArea = ({ }) => {
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState("");
   const [chatTitle, setChatTitle] = useState("");
   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [currentSection, setCurrentSection] = useState(0);
   const [showValue, setShowValue] = useState(false);
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
      setMessages([...messages, { sender: "user", text: message || file.name, type: file.type || '' }]);
      setLoading(true);
      setError(null);

      try {
         const response = await axios.post("http://localhost:3001/review", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         const botResponse = response.data.review || "No response received.";
         setMessages([...messages,{ sender: "user", text: message || file.name, type: file.type || '' }, { sender: "bot", text: botResponse }]);
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
      if (!selectedFile) return;
      setFile(selectedFile);
   };

   return (
      <div className="chat-area">
         <div className="messages-container">
            {messages.map((msg, index) => {
               const {
                  updatedCode = [],
                  potentialBugs = [],
                  securityRisks = [],
                  syntaxErrors = [],
                  deprecatedPatterns = [],
                  outdatedLibraries = [],
                  improvements = [],
               } = msg.text;

               const sections = [
                  { label: "Improvements: ", data: improvements },
                  { label: "Potential Bugs: ", data: potentialBugs },
                  { label: "Security Risks: ", data: securityRisks },
                  { label: "Syntax Errors: ", data: syntaxErrors },
                  { label: "Deprecated Patterns: ", data: deprecatedPatterns },
                  { label: "Outdated Libraries: ", data: outdatedLibraries },
               ];

               return (
                  <div key={index} className={`message ${msg.sender}-message`}>
                     {(msg.sender === 'user') ? (
                        msg.type ?
                           <div className="userIcon-file-preview">
                              <div className="userIcon file-icon"> <FileIcon /></div>
                              <div className="file-info">
                                 <div className="userIcon file-name">{msg.text}</div>
                              </div>
                           </div>
                           : <div>{msg.text}</div>
                     ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                           <div className="code-container">
                              <SyntaxHighlighter language="javascript" style={darcula}>
                                 {updatedCode}
                              </SyntaxHighlighter>
                           </div>
                           <div>
                              {sections.map((section, index) => {
                                 if (section.data.length === 0 || index > currentSection) return null;

                                 return (
                                    <p className="padding-bottom" key={index}>
                                       {/* Currently animating section */}
                                       {index === currentSection && (
                                          <>
                                             <TypingText
                                                text={section.label}
                                                customClass="customfont"
                                                onDone={() => {
                                                   setShowValue(true);
                                                }}
                                             />
                                             {showValue && (
                                                <TypingText
                                                   text={section.data.join(", ")}
                                                   onDone={() => {
                                                      setCurrentSection((prev) => prev + 1);
                                                      setShowValue(false);
                                                   }}
                                                   customClass="customValueFont"
                                                />
                                             )}
                                          </>
                                       )}
                                       {/* Already completed sections */}
                                       {index < currentSection && (
                                          <>
                                             <span className="customfont">{section.label}</span>{" "}
                                             <span>{section.data.join(", ")}</span>
                                          </>
                                       )}
                                    </p>
                                 );
                              })}
                           </div>
                        </div>
                     )}{" "}
                  </div>
               );
            })}
            {loading && (
               <div className="message bot-message thinking-bubble">
                  <div className="dot-typing">
                     <span></span>
                     <span></span>
                     <span></span>
                  </div>
               </div>
            )}
            <div ref={bottomRef} />
         </div>
         {/* The input-container has the first input as file upload which does not actually 
 upload the file but displays the file name in the chat. Use Multer to upload the file*/}
         <form className="input-container" onSubmit={handleSubmit}>
            <input type="file" id="fileUpload" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="fileUpload" className="upload-btn">
               📎
            </label>
            <div className="input-box-with-preview">
               {file && (
                  <div className="file-preview">
                     <div className="file-icon"> <FileIcon /></div>
                     <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-type">{file.type?.split("/")[1]?.toUpperCase() || "FILE"}</div>
                     </div>
                     <div className="file-remove" onClick={() => setFile(null)}><X /></div>
                  </div>
               )}
               {!file && (
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
