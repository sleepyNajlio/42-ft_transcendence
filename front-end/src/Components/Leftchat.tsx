import React from 'react';
import '../styles/css/chatui.css';
import ChatHeaderComponent from './ChatHeaderComponent.tsx';
import Messageco from './Messageco.tsx'
import Sendmessage from './Sendmessage.tsx';
// import messi from '../assets/messi.jpg'
import ftlogo from '/ftlogo.png';


const Leftchat: React.FC = (props: any) => {

  // console.log("user is owner : " + props.isOwner);

  if (props.showRoom)
  {
    // console.log("Show room called in left chat with " + props.Roomtype);
    // console.log(props.Roomtype);
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName={props.name} showRoom={props.showRoom} isOwner={props.isOwner} isAdmin={props.isAdmin} profileImageUrl={ftlogo}
          Roomtype={props.Roomtype} handleAdmin={props.handleAdmin}getChatUsers={props.getChatUsers} chatUsers={props.chatUsers} handleUpdateRoom={props.handleUpdateRoom} handleDisplayRoom={props.HandleDisplayRoom}
          room={props.room}/>
        <div className="msg-section">
        {props.messages.map((message: any, index: any) => (
            <Messageco 
            key={index}
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
  else if (props.showDm)
  {
    // console.log("show dm called in left chat with");
    // console.log("name : " +  props.name);
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName={props.name} showDm={props.showDm} profileImageUrl={props.Friends.find((friend: any) => friend.username === props.name)?.avatar || ftlogo} />
        <div className="msg-section">
        {props.messages.map((message: any, index: any) => (
            <Messageco 
            key={index}
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