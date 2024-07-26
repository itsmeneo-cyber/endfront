import React from 'react';
import '../index.css'; // Import the CSS file

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
