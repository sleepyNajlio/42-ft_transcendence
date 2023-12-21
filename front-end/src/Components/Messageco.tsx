import React from 'react';
import '../styles/css/Messageco.css';

interface MessageComponentProps {
    text: string;
    profileImageUrl: string; // Add a prop for the profile image URL
    isOwnMessage: boolean;
    key : number;
  }
  
  const MessageComponent: React.FC<MessageComponentProps> = ({ key, text, profileImageUrl, isOwnMessage }) => {
    return (
      <div key={key} className={`message-container ${isOwnMessage ? 'own-message' : 'friend-message'}`}>
        <img className="sender-image" src={profileImageUrl} alt="Profile" style={{ width: '33px', height:'33px' }} />
        <div className="message-text">{text} </div>
      </div>
    );
  };
  
  export default MessageComponent;