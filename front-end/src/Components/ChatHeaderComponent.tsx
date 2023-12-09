// ChatHeaderComponent.tsx
import React from 'react';
import game from '../assets/game_2_fill.png'
import block from '../assets/blockchat.png'
// import './ChatHeaderComponent.css'; // You can create a CSS file for styling

interface ChatHeaderComponentProps {
  friendName: string;
  profileImageUrl: string;
}

const ChatHeaderComponent: React.FC<ChatHeaderComponentProps> = ({ friendName, profileImageUrl }) => {
  return (
    <div className="chat-header-container">
      <img className="profile-image" src={profileImageUrl} alt="Friend" />
      <div className="friend-info">
        <div className="friend-name">{friendName}</div>
      </div>
      {/* <div className="options-icons">
        <div className="option1"><img src={game} alt="jouons" /></div>
        <div className="optuon2"><img src={block} alt="9wd" /></div>   
      </div> */}
    </div>
  );
};

export default ChatHeaderComponent;
