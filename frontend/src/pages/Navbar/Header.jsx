import React, { useState } from "react";
import "./Header.css";
import "../Settings/SettingsModal.css";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../Settings/SettingsModal";

const Header = () => {
   const [showModal, setShowModal] = useState(false);

   const closeHandler = () => {
      setShowModal(false);
   };
   return (
      <header className="header">
         <h1>CodeAI</h1>
         <div className="chat-header">
            <FaCog className="settings-icon" onClick={() => setShowModal(true)} title="Settings" />
         </div>
         {showModal && <SettingsModal cancelListener={closeHandler} />}
      </header>
   );
};

export default Header;
