import React from 'react';
import '../styles/css/chatui.css';
import ChatHeaderComponent from './ChatHeaderComponent.tsx';
import Messageco from './Messageco.tsx'
import Sendmessage from './Sendmessage.tsx';
// import messi from '../assets/messi.jpg'
import ftlogo from '/ftlogo.png';


const Leftchat: React.FC = (props: any) => {

  console.log("Messages isssss : ", props.messages);

  const handleMenuOptionClick = (option: string) => {
    // Perform actions based on the selected option
    if (option === 'kick') {
      // Handle kick action
    } else if (option === 'ban') {
      // Handle ban action
    } else if (option === 'mute_1min') {
      // Handle mute for 1 minute
    } else if (option === 'mute_5min') {
      // Handle mute for 5 minutes
    }
  };

  // console.log("user is owner : " + props.isOwner);

  if (props.showRoom)
  {
    // console.log("Show room called in left chat with " + props.Roomtype);
    // console.log(props.Roomtype);
    return (
      <div className="composant-gauche">
        <ChatHeaderComponent friendName={props.name} showRoom={props.showRoom} isOwner={props.isOwner} isAdmin={props.isAdmin} profileImageUrl={ftlogo}
          Roomtype={props.Roomtype} handleAdmin={props.handleAdmin}getChatUsers={props.getChatUsers} chatUsers={props.chatUsers} handleUpdateRoom={props.handleUpdateRoom} handleDisplayRoom={props.HandleDisplayRoom}
          room={props.room} handleleave={props.handleleave}/>
        <div className="msg-section">
        {props.messages.map((message: any, index: any) => (
            <Messageco 
            key={index}
            text={message.message}
            profileImageUrl={message.user.avatar}
            isOwnMessage={message.userId === props.userid ? true : false}
            onMenuOptionClick = {handleMenuOptionClick}
            users={props.chatUsers}
            room={props.room}
            messageId = {message.userId}



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