import React from 'react';
import '../styles/css/chatui.css';
import ChatHeaderComponent from './ChatHeaderComponent.tsx';
import Messageco from './Messageco.tsx'
import Sendmessage from './Sendmessage.tsx';
import messi from '../assets/messi.jpg'

const Leftchat: React.FC = () => {
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName="messi lionel" profileImageUrl={messi}/>
        <div className="msg-section">
        <Messageco
            text="This is your message."
            profileImageUrl={messi}
            isOwnMessage={true}
        />
        <Messageco
            text="This is your friend's message."
            profileImageUrl={messi}
            isOwnMessage={false}
        />
                <Messageco
            text="This is your message."
            profileImageUrl={messi}
            isOwnMessage={true}
        />
        <Messageco
            text="This is your friend's message."
            profileImageUrl={messi}
            isOwnMessage={false}
        />
                <Messageco
            text="This is your message."
            profileImageUrl={messi}
            isOwnMessage={true}
        />
        <Messageco
            text="This is your friend's message."
            profileImageUrl={messi}
            isOwnMessage={false}
        />
                <Messageco
            text="This is your message."
            profileImageUrl={messi}
            isOwnMessage={true}
        />
        <Messageco
            text="This is your friend's message."
            profileImageUrl={messi}
            isOwnMessage={false}
        />
                <Messageco
            text="This is your message."
            profileImageUrl={messi}
            isOwnMessage={true}
        />
        <Messageco
            text="This is your friend's message."
            profileImageUrl={messi}
            isOwnMessage={false}
        />
        </div>
        <Sendmessage onSendMessage={()=>{}}/>
      </div>
    );
  };

  export default Leftchat;