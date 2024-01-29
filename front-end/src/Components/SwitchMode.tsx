import React from "react";
import "../styles/css/chatui.css";






const SwitchMode : React.FC = (props: any)=> {
    return (
      <div className="switch-container">
        <span className="switch-label">Dark Mode</span>
        <label className="switch">
          <input type="checkbox" onChange={props.toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
    );
  };

export default SwitchMode;