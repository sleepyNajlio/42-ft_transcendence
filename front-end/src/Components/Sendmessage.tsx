import React, { useState } from 'react';
import '../styles/css/Sendmessage.css';
import send from '../assets/SendIcon.png'

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };
  const enter = (e: any) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  }

  return (
    <div className="message-input-container">
    <div className="inputfield">
    <input className="inputsend"
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleMessageChange}
        onKeyDown={enter}
      />
      <button onClick={handleSendClick}>
        <img src={send} alt="Icon2" />
      </button>
    </div>
    </div>
  );
};

export default MessageInput;
