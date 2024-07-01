import React from 'react';

const Button = ({ onClick, text="O" , disabled = false}) => (
  <button
    onClick={onClick}
    className={"pl-2 text-2xl   " + (disabled ? "text-red-400" : "text-white hover:text-red-500")}
    disabled={disabled}
  >
    {text}
  </button>
);

export default Button;