import React, { useEffect, useState } from "react";

const TypingText = ({ text, speed = 30, onDone, customClass }) => {
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (onDone) {
            onDone(); // Tell parent we're done typing
        }
    }, [index, text, speed, onDone]);

    return <span className={customClass}>{displayedText}</span>;
};


export default TypingText;
  