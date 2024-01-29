// ButtonComponent.tsx
// import React from 'react';
import '../styles/css/Switchgrpdm.css';

export default function ButtonComponent(props : any){


  return (
    <div className="button-container">
      <button className="button" onClick={props.HandleDisplayDms}>Inbox </button>
      <button className="button" onClick={props.HandleDisplayRoom}>Communities</button>
      <div className="createico" >
      {props.DisplayRoom && (
        <svg viewBox="6 6 24 24" onClick={() => props.setCreating(!props.creating)} fill="currentColor" width="20" height="20" overflow="visible"><path d="M17.305 16.57a1.998 1.998 0 0 0-.347.467l-1.546 2.87a.5.5 0 0 0 .678.677l2.87-1.545c.171-.093.328-.21.466-.347l8.631-8.631a1.5 1.5 0 1 0-2.121-2.122l-8.631 8.632z"></path><path d="M18 10.5a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-6a1 1 0 0 0-1-1h-.5a1 1 0 0 0-1 1v6a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h6z"></path></svg>
        )
      }
      </div>
    </div>
  );
};
