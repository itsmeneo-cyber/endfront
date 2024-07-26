import React from 'react';

// Define the button component
const GlowingButton = ({ text }) => {
  return (
    <button style={styles.button} role="button">
      {text}
    </button>
  );
};

// Define the styles in a JavaScript object
const styles = {
  button: {
    padding: '0.6em 2em',
    border: 'none',
    outline: 'none',
    color: '#fff',
    background: '#111',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 0,
    borderRadius: '10px',
    userSelect: 'none',
    touchAction: 'manipulation',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    overflow: 'hidden',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
    // Add transition for smoother effects
    transition: 'background 0.3s ease',
  },
  buttonBefore: {
    content: '""',
    background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    backgroundSize: '400%',
    zIndex: -1,
    filter: 'blur(5px)',
    width: 'calc(100% + 4px)',
    height: 'calc(100% + 4px)',
    animation: 'glowing-button-85 20s linear infinite',
    borderRadius: '10px',
  },
  buttonAfter: {
    zIndex: -1,
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#222',
    left: '0',
    top: '0',
    borderRadius: '10px',
  },
};

// Add keyframes animation to global styles
const keyframes = `
@keyframes glowing-button-85 {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}
`;

// Create a <style> element with the keyframes animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default GlowingButton;
