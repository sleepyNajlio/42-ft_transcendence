import React, { useEffect } from 'react';
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
  onMenuOptionClick: (option: string) => void;
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
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [lastClickedmessage_Id, setLastClickedmessage_Id] = useState<number | null>(null);

  // console.log("useeers in messageco : " , users);
  // console.log("room in messageco : " , room);
  const isUserOwner =  Array.isArray(users) &&  users.some((user: { userId: number; role: string; }) => user.userId === message_userId && user.role === 'OWNER');
  // const isUserAdmin =  Array.isArray(users) &&  users.some((user: { userId: number; role: string; }) => user.userId === message_userId && user.role === 'ADMIN');
  // console.log("is user not owner : " , isUserNotOwner);
  // console.log("id of the message : " , message_id);


  const handleMenuToggle = () => {
    // if (lastClickedmessage_Id !== message_id)
    // {
    //   setLastClickedmessage_Id(message_id);
    //   setIsMenuOpen(true);
    // }
    // else
    // {
    //   if (lastClickedmessage_Id === message_id)
    //     setIsMenuOpen(!isMenuOpen);
    // }
    // console.log("is menu opennn : " , isMenuOpen);
    // console.log('last clicked message id innnnnn: ' , lastClickedmessage_Id);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionClick = (option: string, name : string, userId : number) => {
    onMenuOptionClick(option, name, userId);
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
  {!isOwnMessage && room && room.chatUser && room.chatUser.role === 'ADMIN' && !isUserOwner &&(
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