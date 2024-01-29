import React, { useRef } from 'react';
import '../styles/css/chatui.css';
import ChatHeaderComponent from './ChatHeaderComponent.tsx';
import Messageco from './Messageco.tsx'
import Sendmessage from './Sendmessage.tsx';
// import messi from '../assets/messi.jpg'
import ftlogo from '/ftlogo.png';


const Leftchat: React.FC = (props: any) => {

  const openMenuRef = useRef(null);
  
  const lightModeClass = "light-mode";
  const darkModeClass = "dark-mode";

  // console.log("Messages isssss : ", props.messages);

  // const MessageRef = useRef(null);

  const handleMenuOptionClick = (option: string, name : string, userId : number) => {
    // Perform actions based on the selected option
    if (option === 'kick') {
      console.log("user want to kick in " + name + "user with id : " + userId);
      props.handleKick(name, userId);
    } else if (option === 'ban') {
      console.log("user want to ban in " + name + "user with id : " + userId);
      props.handleBan(name, userId);

    } else if (option === 'mute') {
      console.log("user want to mute in " + name + "user with id : " + userId);
      props.handleMute(name, userId);
    }
  };


  // console.log("user is owner : " + props.isOwner);

  if (props.showRoom)
  {
    // console.log("Show room called in left chat with " + props.Roomtype);
    // console.log(props.Roomtype);
    return (
      <div className={`composant-gauche ${props.darkMode ? darkModeClass : lightModeClass}`}>
        <ChatHeaderComponent friendName={props.name} showRoom={props.showRoom} isOwner={props.isOwner} isAdmin={props.isAdmin} profileImageUrl={ftlogo}
          Roomtype={props.Roomtype} handleAdmin={props.handleAdmin}getChatUsers={props.getChatUsers} chatUsers={props.chatUsers} handleUpdateRoom={props.handleUpdateRoom} handleDisplayRoom={props.HandleDisplayRoom}
          room={props.room} handleleave={props.handleleave} friends={props.Friends}
          handleAddUser={props.handleAddUser} darkMode={props.darkMode}  />
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
            message_userId = {message.userId}
            message_id = {message.id3_chat_message}

            openMenuRef= {openMenuRef}

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
        <ChatHeaderComponent friendName={props.name} showDm={props.showDm} profileImageUrl={props.Friends.find((friend: any) => friend.username === props.name)?.avatar || ftlogo}
        setProfile={props.setProfile} setHistory={props.setHistory} friendId={props.Friends.find((friend: any) => friend.username === props.name)?.id_player}
        setInviter={props.setInviter}/>
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
            message_userId = {message.userId}
            message_id = {message.id3_chat_message}
            openMenuRef= {openMenuRef}
            />
        ))}
            </div>
        <Sendmessage onSendMessage={props.sendMessageDm}/>
      </div>
    );
  }
  };

  export default Leftchat;