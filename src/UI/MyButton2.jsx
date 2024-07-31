import React from 'react';
import '../index.css'; 

const MyButton2 = ({ children, onClick }) => {
  return (
    <button
      className="button-87"
      role="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MyButton2;
