import React from 'react';
import { useState } from 'react';
import threedots from '../assets/three-dots.png';

import '../styles/css/Messageco.css';

interface MessageComponentProps {
  text: string;
  profileImageUrl: string;
  isOwnMessage: boolean;
  users : any;
  room : any;
  messageId : number;
  onMenuOptionClick: (option: string) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  text,
  profileImageUrl,
  isOwnMessage,
  onMenuOptionClick,
  users,
  room,
  messageId,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  console.log("useeers in messageco : " , users);
  console.log("room in messageco : " , room);
  console.log("id if the message : " , messageId);
  const isUserOwner =  Array.isArray(users) &&  users.some((user: { userId: number; role: string; }) => user.userId === messageId && user.role === 'OWNER');
  // console.log("is user not owner : " , isUserNotOwner);

  const handleMute = () => {
    setIsMuted(true);
    // setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionClick = (option: string) => {
    onMenuOptionClick(option);
    setIsMenuOpen(false);
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
    <div className='menu-click' onClick={handleMenuToggle}>
      <img title="options" src={threedots} width='20' height='20' alt="leave" />
      {isMenuOpen && (
        <div className="message-menu">
          <div className="menu-option" onClick={() => handleMenuOptionClick('kick')}>
            Kick
          </div>
          <div className="menu-option" onClick={() => handleMenuOptionClick('ban')}>
            Ban
          </div>
          <div className="menu-submenu" onClick={handleMute}>
            Mute
            {isMuted && (
              <>
                <div className="submenu-option" onClick={() => handleMenuOptionClick('mute_1min')}>
                  1 minute
                </div>
                <div className="submenu-option" onClick={() => handleMenuOptionClick('mute_5min')}>
                  5 minutes
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
  )}
  {!isOwnMessage && room && room.chatUser && room.chatUser.role === 'ADMIN' && !isUserOwner &&  (
    <div className='menu-click' onClick={handleMenuToggle}>
      <img title="options" src={threedots} width='20' height='20' alt="leave" />
      {isMenuOpen && (
        <div className="message-menu">
          <div className="menu-option" onClick={() => handleMenuOptionClick('kick')}>
            Kick
          </div>
          <div className="menu-option" onClick={() => handleMenuOptionClick('ban')}>
            Ban
          </div>
          <div className="menu-submenu" onClick={handleMute}>
            Mute
            {isMuted && (
              <>
                <div className="submenu-option" onClick={() => handleMenuOptionClick('mute_1min')}>
                  1 minute
                </div>
                <div className="submenu-option" onClick={() => handleMenuOptionClick('mute_5min')}>
                  5 minutes
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
  )}
  </div>

  );
};

export default MessageComponent;