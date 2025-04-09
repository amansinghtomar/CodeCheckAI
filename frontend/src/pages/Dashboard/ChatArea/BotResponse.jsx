import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import TypingText from "../../../components/TypingText";

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

   const formatToBulletPoints = (textArray) => {
      return textArray
         .flatMap(text =>
            text
               .split(/\. (?=[A-Z])|\. *$/) // Smart split on full stop followed by uppercase or end
               .map(sentence => sentence.trim())
         )
         .filter(Boolean);
   };

   return (
      <div className="bot-response" style={{ width: "100%" }}>
         <SyntaxHighlighter language="javascript" style={darcula}>
            {updatedCode}
         </SyntaxHighlighter>

         {sections.map((section, index) => {
            if (section.data.length === 0 || index > currentSection) return null;

            const bulletPoints = formatToBulletPoints(section.data);

            return (
               <div className="padding-bottom" key={index}>
                  {index === currentSection ? (
                     <>
                        <TypingText text={section.label} customClass="customfont" onDone={() => setShowValue(true)} />
                        {showValue && (
                           <ul className="customValueFont" style={{ marginTop: "8px", marginLeft: "20px" }}>
                              {bulletPoints.map((point, i) => (
                                 <li key={i}>
                                    <TypingText
                                       text={point + "."}
                                       onDone={i === bulletPoints.length - 1 ? () => {
                                          setCurrentSection((prev) => prev + 1);
                                          setShowValue(false);
                                       } : undefined}
                                    />
                                 </li>
                              ))}
                           </ul>
                        )}
                     </>
                  ) : (
                     <>
                        <span className="customfont">{section.label}</span>
                        <ul className="customValueFont" style={{ marginLeft: "20px" }}>
                           {bulletPoints.map((point, i) => (
                              <li key={i}>{point}.</li>
                           ))}
                        </ul>
                     </>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default BotResponse;
