// StylishLoader.js
import React from "react";
import "./StylishLoader.css";

const StylishLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-circle circle1"></div>
        <div className="loader-circle circle2"></div>
        <div className="loader-circle circle3"></div>
        <div className="loader-circle circle4"></div>
      </div>
    </div>
  );
};

export default StylishLoader;
