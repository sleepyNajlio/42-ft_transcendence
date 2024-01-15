import '../styles/css/inboxBox.css';
import messi from '../assets/messi.jpg';
import { useState } from 'react';
// interface UserInfoProps {
//   profilePicture: string;
//   name: string;
//   onModifyProfileClick: () => void;
// }

// const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name, onModifyProfileClick }) => {
  function profilePicture(avatar : any) {

    


    return (
      <div className="profile-picture">
        <img
          src={avatar} // Replace with the path to your profile image
          alt="Profile"
          width="100%"
          height="100%"
        />
      </div>
    );
  }
  export default function InboxBox(props : any) {
    
    // console.log("props in inboxbox : ")
    // console.log("room in inbox box: " + props.room.users);
    // if (props.room.chatUser)
    //   console.log(props.room.chatUser.userId);
    // console.log('userId issss: ' + props.userId)
    // console.log("props.room.users : " , props.room.users);
    // console.log("props.id : " , props.id);
    // console.log("props.lastmes : " , props.lastMessage);
   
    const handleImageClick = () => {
      props.joindDm(props.friend.username);
    };

    if (props.DisplayRoom)
    {
      return (
        <div className="simple-component">
          {props.room.type === 'PROTECTED' && !props.room.chatUser ? (
                  <>
                     <button className="text-container" onClick={()=>props.handleRoomClick(props.room)}>
                        {profilePicture(messi)}
                        <div className="message-style">
                          <p className="text1">{props.room.name}</p>
                          <p className="text2"></p>
                        </div>
                    </button>
                    {props.selectedRoom && props.selectedRoom.name === props.room.name
                      && props.passjoin && (
                      <div> 
                        <input
                          type="text"
                          placeholder="Enter password"
                          name={`${props.room.name}`}
                          id={props.room.name}
                          value={props.selectedPswd}
                          onChange={props.handleSelectedPassword}
                        />
                       <button name={props.room.name} onClick={props.handleJoinWithPassword}>Join</button>
                      </div>
                    )}
                  </>
          ) : (
            <button className="text-container" onClick={()=>props.handleRoomClick(props.room)}>
            {profilePicture(messi)}
            <div className="message-style">
              <p className="text1">{props.room.name}</p>
              <p className="text2">{props.room.lastMessage ? props.room.lastMessage.user.username + ": " 
              + props.room.lastMessage.message  : ""}</p>
            </div>
          </button>
          )}
        </div>
      );
    }
    else {
      return (
        <div className="simple-component">
        <button className="text-container" onClick={handleImageClick}>
          <div className="profile-picture">
          {profilePicture(props.friend.avatar)}
          </div>
          <div className="message-style">
            <p className="text1">{props.friend.username}</p>
            <p className="text2">{props.friend.lastMessage ? props.friend.lastMessage.user.username + ': ' 
            + props.friend.lastMessage.message : ''}</p>
          </div>
        </button>
      </div>
      );
    }
}