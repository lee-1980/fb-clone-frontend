import React, { useState } from "react";
import { sendIcon } from "../../assets";
import "./input.css";

const Input = ({ placeholder, handler }) => {
   const [value, setValue] = useState("");
   return (
      <form
         className="input__box"
         onSubmit={async (e) => {
            e.preventDefault();
            if (value) await handler(value);
            setValue("");
         }}
      >
         <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
         />
         <button type="submit">
            <img src={sendIcon} alt="send" />
         </button>
      </form>
   );
};

export default Input;
