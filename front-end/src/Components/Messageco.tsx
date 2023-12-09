import React from 'react';
import '../styles/css/Messageco.css';

interface MessageComponentProps {
    text: string;
    profileImageUrl: string; // Add a prop for the profile image URL
  }
  
  const MessageComponent: React.FC<MessageComponentProps> = ({ text, profileImageUrl }) => {
    return (
      <div className="message-container">
        <img className="profile-image" src={profileImageUrl} alt="Profile" />
        <div className="message-text">{text}</div>
      </div>
    );
  };
  
  export default MessageComponent;