import React, { useRef } from "react";

const AccessCodeInput = ({ code, setCode, error }) => {
    const inputsRef = useRef([]);


    const handleChange = (e, index) => {
        let value = e.target.value;
        if (!/^\d?$/.test(value)) return; // Sólo permitir vacío o un dígito
      
        const newCode = code.split("").concat(Array(4).fill("")); // aseguro longitud
        newCode[index] = value;
        setCode(newCode.slice(0, 4).join(""));
      
        if (value && index < inputsRef.current.length - 1) {
          inputsRef.current[index + 1].focus();
        }
      };
      

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div className="access-code-container">
            <div className="access-code-inputs">
                {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                        <input
                            key={idx}
                            type="number"
                            inputMode="numeric"
                            pattern="\\d*"
                            maxLength={1}
                            value={code[idx] || ""}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            className={`access-code-input ${error ? "error" : ""}`}
                            aria-label={`Dígito ${idx + 1}`}
                            autoFocus={idx === 0}
                        />
                    ))}
            </div>
            {error && <div className="access-code-error">{error}</div>}
        </div>
    );
};

export default AccessCodeInput;
