import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import threedots from '../assets/three-dots.png';

import '../styles/css/Messageco.css';

interface MessageComponentProps {
  text: string;
  profileImageUrl: string;
  isOwnMessage: boolean;
  users : any;
  room : any;
  message_userId : number;
  message_id : number;
  onMenuOptionClick: (option: string, name : string, userId : number) => void;
  handleBoxClose: () => void;
  handleButtonClick: (event: React.MouseEvent<HTMLDivElement>) => void; // Update the type here
  isVisible: boolean;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  text,
  profileImageUrl,
  isOwnMessage,
  onMenuOptionClick,
  users,
  room,
  message_userId,
  message_id,
  handleBoxClose,
  handleButtonClick,
  isVisible,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastClickedmessage_Id, setLastClickedmessage_Id] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const isUserOwner =
    Array.isArray(users) &&
    users.some((user: { userId: number; role: string }) => user.userId === message_userId && user.role === 'OWNER');


  const handleMenuOptionClick = (option: string, name: string, userId: number) => {
    handleBoxClose();
    onMenuOptionClick(option, name, userId);
  };

  return (
    <div className={`message-container ${isOwnMessage ? 'own-message' : 'friend-message'}`}>
  <img
    className="sender-image"
    src={profileImageUrl}
    alt="Profile"
    style={{ width: '33px', height: '33px' }}
  />
  <div className="message-text">
    {text}
  </div>
  {!isOwnMessage && room && room.chatUser && room.chatUser.role === 'OWNER' && (
    <div className='menu-click' onClick={handleButtonClick}>
      <img title="options" src={threedots} width='20' height='20' alt="leave" />
      {isVisible && (
        <div className="message-menu">
          <div className="menu-option" onClick={() => handleMenuOptionClick('kick', room.name, message_userId)}>
            Kick
          </div>
          <div className="menu-option" onClick={() => handleMenuOptionClick('ban', room.name, message_userId)}>
            Ban
          </div>
          <div className="menu-option" onClick={() => handleMenuOptionClick('mute', room.name, message_userId)}>
            Mute
            <span style={{ fontSize: '12px' }}> (5min) </span>
          </div>
        </div>
      )}
      
    </div>
  )}
  {!isOwnMessage && room && room.chatUser && room.chatUser.role === 'ADMIN' && !isUserOwner &&
     !room.chatUser.isBanned && (
    <div className='menu-click' onClick={handleButtonClick}>
    <img title="options" src={threedots} width='20' height='20' alt="leave" />
    {isVisible && (
      <div className="message-menu">
        <div className="menu-option" onClick={() => handleMenuOptionClick('kick', room.name, message_userId)}>
          Kick
        </div>
        <div className="menu-option" onClick={() => handleMenuOptionClick('ban', room.name, message_userId)}>
          Ban
        </div>
        <div className="menu-option" onClick={() => handleMenuOptionClick('mute', room.name, message_userId)}>
          <>Mute</> <br/>
          <span style={{ fontSize: '12px' }}>(5min)</span>
        </div>
      </div>
    )}
      
    </div>
  )}
  </div>

  );
};

export default MessageComponent;