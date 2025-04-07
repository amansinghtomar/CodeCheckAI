import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import TypingText from "../TypingText";

const BotResponse = ({ textObj }) => {
   const {
      updatedCode = [],
      potentialBugs = [],
      securityRisks = [],
      syntaxErrors = [],
      deprecatedPatterns = [],
      outdatedLibraries = [],
      improvements = [],
   } = textObj;

   const sections = [
      { label: "Improvements:", data: improvements },
      { label: "Potential Bugs:", data: potentialBugs },
      { label: "Security Risks:", data: securityRisks },
      { label: "Syntax Errors:", data: syntaxErrors },
      { label: "Deprecated Patterns:", data: deprecatedPatterns },
      { label: "Outdated Libraries:", data: outdatedLibraries },
   ];

   const [currentSection, setCurrentSection] = useState(0);
   const [showValue, setShowValue] = useState(false);

   return (
      <div className="bot-response">
         <SyntaxHighlighter language="javascript" style={darcula}>
            {updatedCode}
         </SyntaxHighlighter>
         {sections.map((section, index) => {
            if (section.data.length === 0 || index > currentSection) return null;
            return (
               <p className="padding-bottom" key={index}>
                  {index === currentSection ? (
                     <>
                        <TypingText text={section.label} customClass="customfont" onDone={() => setShowValue(true)} />
                        {showValue && (
                           <TypingText
                              text={section.data.join(", ")}
                              customClass="customValueFont"
                              onDone={() => {
                                 setCurrentSection((prev) => prev + 1);
                                 setShowValue(false);
                              }}
                           />
                        )}
                     </>
                  ) : (
                     <>
                        <span className="customfont">{section.label}</span>
                        <span>{section.data.join(", ")}</span>
                     </>
                  )}
               </p>
            );
         })}
      </div>
   );
};

export default BotResponse;
