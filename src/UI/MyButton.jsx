import React from 'react';

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '16px',
  padding: '0.7em 1.4em 0.7em 1.1em',
  color: 'white',
  background: 'linear-gradient(0deg, rgba(20,167,62,1) 0%, rgba(102,247,113,1) 100%)',
  border: 'none',
  boxShadow: '0 0.7em 1.5em -0.5em #14a73e98',
  letterSpacing: '0.05em',
  borderRadius: '20em',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'manipulation',
};

const hoverStyle = {
  boxShadow: '0 0.5em 1.5em -0.5em #14a73e98',
};

const activeStyle = {
  boxShadow: '0 0.3em 1em -0.5em #14a73e98',
};

const MyButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      style={{
        ...buttonStyle,
        ...(isHovered ? hoverStyle : {}),
        ...(isActive ? activeStyle : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {children}
    </button>
  );
};

export default MyButton;
