import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import threedots from '../assets/three-dots.png';

import '../styles/css/Messageco.css';
import { Prev } from 'react-bootstrap/esm/PageItem';

interface MessageComponentProps {
  text: string;
  profileImageUrl: string;
  isOwnMessage: boolean;
  users : any;
  room : any;
  message_userId : number;
  message_id : number;
  onMenuOptionClick: (option: string, name : string, userId : number) => void;
  openMenuRef: any;
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
  openMenuRef,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const isUserOwner =
    Array.isArray(users) &&
    users.some((user: { userId: number; role: string }) => user.userId === message_userId && user.role === 'OWNER');

  const handleMenuToggle = () => {
    // setIsMenuOpen((prevvIsMenuOpen) => !prevvIsMenuOpen);
    // setWasopen(true);
    if (openMenuRef.current) {
      openMenuRef.current.closeMenu();
    }

    setIsMenuOpen(!isMenuOpen);
    openMenuRef.current = {
      closeMenu: () => setIsMenuOpen(false),
    };
  };

  useEffect(() => {
    // Add event listener to close menu on click outside
    const handleClickOutside = (event: MouseEvent) => {

      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuOptionClick = (option: string, name: string, userId: number) => {
    onMenuOptionClick(option, name, userId);
    setIsMenuOpen(!isMenuOpen);
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
    <div className='menu-click' onClick={handleMenuToggle} ref={menuRef}>
      <img title="options" src={threedots} width='20' height='20' alt="leave" />
      {isMenuOpen && (
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
    <div className='menu-click' onClick={handleMenuToggle}>
    <img title="options" src={threedots} width='20' height='20' alt="leave" />
    {isMenuOpen && (
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