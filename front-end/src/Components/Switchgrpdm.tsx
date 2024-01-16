// ButtonComponent.tsx
// import React from 'react';
import '../styles/css/Switchgrpdm.css';

export default function ButtonComponent(props : any){
  return (
    <div className="button-container">
      <button className="button" onClick={props.HandleDisplayDms}>Inbox </button>
      <button className="button" onClick={props.HandleDisplayRoom}>Communities</button>
    </div>
  );
};
