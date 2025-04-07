import React, { useState } from "react";
import Select from "react-select";
import "./SettingsModal.css";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";
import { useNavigate } from "react-router-dom";

const languageOptions = [
   { value: "javascript", label: "JavaScript" },
   { value: "python", label: "Python" },
   { value: "react", label: "React" },
   { value: "java", label: "Java" },
   { value: "csharp", label: "C#" },
   { value: "typescript", label: "TypeScript" },
   { value: "go", label: "Go" },
   { value: "ruby", label: "Ruby" },
];

const SettingsModal = ({ cancelListener }) => {
   const [selectedLanguages, setSelectedLanguages] = useState([]);
   const [customCriteria, setCustomCriteria] = useState("");
   const navigate = useNavigate();

   const { logout } = useAuthFunctions();

   const handleLogout = async () => {
      try {
         await logout();
         navigate("/login");
         cancelListener(false);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <>
         <div className="modal-overlay">
            <div className="modal-content">
               <p className="padding-bottom">Review Criteria:</p>
               <Select
                  id="reviewCriteria"
                  isMulti
                  options={languageOptions}
                  value={selectedLanguages}
                  onChange={setSelectedLanguages}
                  placeholder="Select language types..."
               />

               <label htmlFor="customCriteria" className="criteria-label">
                  Custom Review criteria:
               </label>

               <textarea
                  id="customCriteria"
                  rows="4"
                  value={customCriteria}
                  onChange={(e) => setCustomCriteria(e.target.value)}
                  className="criteria-textarea"
               />

               <button onClick={handleLogout}>Logout</button>
               <div className="modal-actions">
                  <button onClick={() => cancelListener(false)}>Close</button>
                  <button
                     onClick={() => {
                        cancelListener(false);
                     }}
                  >
                     Save
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default SettingsModal;
