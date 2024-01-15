// ChatHeaderComponent.tsx
import React from 'react';
import game from '../assets/PlayIcon.png'
import block from '../assets/BlockIcon.png'
import profil from '../assets/ProfilIcon.png'

// import block from '../assets/blockchat.png'
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
  <div className="icons-container">
    <div className='game'>
      <img src={game} alt="Icon1" />
    </div>
    <div className='blank'>
    </div>
    <div className='block'>
      <img src={block} alt="Icon2" />
    </div>
    <div className='blank'>
    </div>
    <div className='profil'>
      <img src={profil} alt="Icon2" />
    </div>
  </div>
</div>
  );
};

export default ChatHeaderComponent;
