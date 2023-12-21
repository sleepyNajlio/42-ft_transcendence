import React from 'react';
import '../styles/css/chatui.css';
import UserInfo from './UserInfo.tsx';
import InboxBox from './InboxBox.tsx';
import Simpleco from './Simpleco.tsx'
import Switchgrpdm from './Switchgrpdm.tsx';

const Rightchat: React.FC = () => {
    return (
      <div className="composant-droite">
        <Simpleco text="Chats"/>
        <UserInfo />
        <Switchgrpdm />
        <div className='messagate'>
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />
            <InboxBox />      
        </div>
      </div>
    );
  };
export default Rightchat;