import React from 'react';
import '../styles/css/chatui.css';
import ChatHeaderComponent from './ChatHeaderComponent.tsx';
import Messageco from './Messageco.tsx'
import Sendmessage from './Sendmessage.tsx';
import messi from '../assets/messi.jpg'

const Leftchat: React.FC = (props: any) => {
  if (props.showRoom)
  {
    console.log("Show room called in left chat");
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName={props.name} profileImageUrl={messi}/>
        <div className="msg-section">
        {props.messages.map((message: any) => (
            <Messageco 
            key={message.id}
            text={message.message}
            profileImageUrl={message.user.avatar}
            isOwnMessage={message.userId === props.userid ? true : false}
            />
        ))}
            </div>
        <Sendmessage onSendMessage={props.sendMessage}/>
      </div>
    );
  }
  else
  {
    console.log("show dm called in left chat with");
    console.log("name : " +  props.name);
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName={props.name} profileImageUrl={props.Friends.find((friend: any) => friend.username === props.name)?.avatar || messi} />
        <div className="msg-section">
        {props.messages.map((message: any) => (
            <Messageco 
            key={message.id}
            text={message.message}
            profileImageUrl={message.user.avatar}
            isOwnMessage={message.userId === props.userid ? true : false}
            />
        ))}
            </div>
        <Sendmessage onSendMessage={props.sendMessageDm}/>
      </div>
    );
  }
  };

  export default Leftchat;