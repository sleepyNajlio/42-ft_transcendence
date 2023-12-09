import React from 'react';
import '../styles/css/Simpleco.css'; // You can create a CSS file for styling

interface ChatComponentProps {
  text: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ text }) => {
  return (
    <div className="chat-container">
      <div className="chat-text">{text}</div>
    </div>
  );
};

export default ChatComponent;