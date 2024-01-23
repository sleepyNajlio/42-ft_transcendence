// ChatHeaderComponent.tsx
import React from 'react';
import { useState } from 'react';
import PofilCard from './PofilCard.tsx';
import MobProfilCard from './MobProfilCard.tsx';
import { Profile } from '../Profile.tsx';
import { useNavigate } from 'react-router-dom';
import game from '../assets/PlayIcon.png'
import block from '../assets/BlockIcon.png'
import profil from '../assets/ProfilIcon.png'
import '../styles/css/Messageco.css';
import adduser from '../assets/adduser.png'
import leave from '../assets/fire-exit.png'
import  Setting from '../assets/setting.png';
import set_admin from '../assets/set_admin.png';
import '../styles/css/ChatHeaderComponent.css'; // You can create a CSS file for styling
// import block from '../assets/blockchat.png'
// import './ChatHeaderComponent.css'; // You can create a CSS file for styling

// interface ChatHeaderComponentProps {
//   friendName: string;
//   profileImageUrl: string;
//   Roomtype : string;
//   showRoom?: boolean;
//   showDm?: boolean;
//   isOwner?: boolean;
//   handleUpdateRoom : () => void;
// }

const SettingsComponent = (props: any) => {
  const [modify, setModify] = useState(false);
  const [setPassword, setSetPassword] = useState(false);
  const [removePassword, setRemovePassword] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const handleModifyClick = () => {
    setModify(true);
    setSetPassword(false);
    setRemovePassword(false);
    // props.setShowSettings(!props.showSettings);
  };
  
  const handleSetClick = () => {
    setSetPassword(true);
    setModify(false);
    setRemovePassword(false);
    // props.setShowSettings(!props.showSettings);
  };
  
  const handleRemoveClick = () => {
    setRemovePassword(true);
    setModify(false);
    setSetPassword(false);
    // props.setShowSettings(!props.showSettings);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleApplyChanges = () => {
    props.setShowSettings(!props.showSettings);
    props.handleUpdateRoom(inputValue, modify, setPassword, removePassword);
    // props.handleDisplayRoom();
    // Logic to apply changes to the server based on modify, set, or remove password state
    // Call your API endpoints here
    // Reset state or take necessary actions
  };


  // console.log("room type in settings : " + props.Roomtype);

  return (
    <div className="settings-navbar">
      {props.Roomtype === 'PROTECTED' && (
        <>
          {!removePassword && < button onClick={handleModifyClick}>Modify Password</button>}
          {!modify && <button onClick={handleRemoveClick}>Remove Password</button>}
        </>
      )}
      {props.Roomtype !== 'PROTECTED' && (
        <>
          {!setPassword && <button onClick={handleSetClick}>Set Password</button>}
        </>
      )}
      {modify && (
        <>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={handleApplyChanges} disabled={!inputValue}>Modify</button>
        </>
      )}
      {setPassword && (
        <>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={handleApplyChanges} disabled={!inputValue}>Set</button>
        </>
      )}
      {removePassword && (
        <button onClick={handleApplyChanges}>Remove</button>
      )}
    </div>
  );
};

// const UserListDropdown = ({ users, handleItemClick }) => {
//   return (
//     <div className="user-list-dropdown">
//       {users.map((user) => (
//         <button key={user.userId} className="admin-button" onClick={() => handleItemClick(user.user.username)}>
//           <img src={user.user.avatar} alt={user.user.username} />
//           {user.user.username}
//         </button>
//       ))}
//     </div>
//   );
// };


const ChatHeaderComponent: React.FC = (props : any) => {
  
  const [showSettings, setShowSettings] = useState(false);
  const [leaveRoom, setLeaveRoom] = useState(false);
  const [setAdmin, setsetAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [DisplayUsers, setDisplayUsers] = useState(false);

  // const navigate = useNavigate();
  // console.log("chatUsers got in chatHeeder : " , props.chatUsers);
  
  // props.chatUsers.map((user: any) => {
    // console.log("user in chat header : " , user);
    // console.log("username in chat header : " , user.user.username);
    // // console.log(user);
    // return null;
  // });

  // console.log("isAdmin is : " , props.isAdmin);
  // console.log("isOwner is : " , props.isOwner);

  const handleSettings = () => {
    setShowSettings(!showSettings);
    if (setAdmin)
      setsetAdmin(!setAdmin);
    if (leaveRoom)
      setLeaveRoom(!leaveRoom);
    if (DisplayUsers)
      setDisplayUsers(!DisplayUsers);

  }
  const handleleave = () => {
    setLeaveRoom(!leaveRoom);
    if (setAdmin)
      setsetAdmin(!setAdmin);
    if (showSettings)
      setShowSettings(!showSettings);
    if (DisplayUsers)
      setDisplayUsers(!DisplayUsers);
    

    // props.handleleave();
  }
  const handlesetAdmin = () => {
    setsetAdmin(!setAdmin);
    if (showSettings)
      setShowSettings(!showSettings);
    if (leaveRoom)
      setLeaveRoom(!leaveRoom);
    if (DisplayUsers)
      setDisplayUsers(!DisplayUsers);
    // setShowSettings(!showSettings);
    // setLeaveRoom(!leaveRoom);
    props.getChatUsers(props.friendName);
  }

  const handleAdmin = (username : string) => {
    console.log("user clicked : " , username);
    props.handleAdmin(username);
  }

  const handleAddUser = (username : string) => {
    setDisplayUsers(!DisplayUsers);
    props.handleAddUser(username);
  }

  const LeaveRoom = () => {
    props.handleleave();
    setLeaveRoom(!leaveRoom);
  }
  const AddUser = () => {
    setDisplayUsers(!DisplayUsers);
    if (showSettings)
      setShowSettings(!showSettings);
    if (leaveRoom)
      setLeaveRoom(!leaveRoom);
    if (setAdmin)
      setsetAdmin(!setAdmin);
  }

    const UserProfile = () => {
      setShowProfile(!showProfile);
      // navigate(`/Profile/${props.friendName}`);
  }
    
  console.log("friend in setting : " , props.friends);

  if (props.showRoom && !props.isOwner && !props.isAdmin)
  {
    return (
      <div className="chat-header-container">
        <img className="profile-image" src={props.profileImageUrl} alt="Friend" />
        <div className="friend-info">
          <div className="friend-name">{props.friendName}</div>
        </div>
        <div className="icons-container">
          <div className='blank'>
          </div>
          <div className='profil' onClick={handleleave}>
            <img title="leave room" src={leave} width='20' height='20' alt="leave" />
          </div>
          {leaveRoom &&
            <div className="leave-box">
              <div className="leave-input">
                <label htmlFor="input"> Are you sure ?</label>
              </div>
              <button onClick={LeaveRoom}>Yes</button>
              <button onClick={handleleave}>No</button>
            </div>
          }
        </div>
      </div>
        );
  }
  if (props.showRoom && props.isOwner)
  {
    return (
      <div className="chat-header-container">
        <img className="profile-image" src={props.profileImageUrl} alt="Friend" />
        <div className="friend-info">
          <div className="friend-name">{props.friendName}</div>
        </div>
        <div className="icons-container">
          <div className='blank'>
          </div>
          <div className='profil' onClick={handleSettings}>
            <img title="Settings" src={Setting} width='20' height='20' style={{ marginLeft: '30px' }} alt="Settings" />
          </div>
          {showSettings && <SettingsComponent  Roomtype={props.Roomtype} setShowSettings={setShowSettings}
              showSettings={showSettings} handleUpdateRoom={props.handleUpdateRoom}
              handleDisplayRoom={props.handleDisplayRoom}/>}
          <div className='blank'>
          </div>
          <div className='profil' onClick={handlesetAdmin}>
            <img title="Set Admin" src={set_admin} width='20' height='20' alt="leave" />
          </div>
          <div className='blank'>
          </div>
          {props.room.type === 'PRIVATE' || props.room.type === 'PROTECTED' &&
            <div className='profil' onClick={AddUser}>
              <img title="Add user" src={adduser} width='22' height='22' alt="leave" />
              {DisplayUsers && (
                  <div className="user-list-dropdown">
                    {props.friends.map((friend: any) => (
                        <button key={friend.id_player} className="admin-button" onClick={() => handleAddUser(friend.username)}>
                          <img src={friend.avatar} alt={friend.username} />
                          {friend.username}
                        </button>
                    ))}
                  </div>
                )
              }
            
            </div>
          }
          {setAdmin && Array.isArray(props.chatUsers) && !props.chatUsers.some((user: any) => user.role === 'ADMIN') && (
          <div className="user-list-dropdown">
            {props.chatUsers.map((user: any) => (
              user && user.role === 'MEMBER' && !user.isBanned && !user.isMuted && (
                <button key={user.userId} className="admin-button" onClick={() => handleAdmin(user.user.username)}>
                  <img src={user.user.avatar} alt={user.user.username} />
                  {user.user.username}
                </button>
              )
            ))}
          </div>

        )}
          <div className='blank'>
          </div>
          <div className='profil'onClick={handleleave} >
            <img title="Leave" src={leave} width='20' height='20' alt="leave" />
          </div>
          {leaveRoom &&
            <div className="leave-box">
              <div className="leave-input">
                <label htmlFor="input"> Are you sure ?</label>
              </div>
              <button onClick={LeaveRoom}>Yes</button>
              <button onClick={handleleave}>No</button>
            </div>
          }
          
        </div>
      </div>
        );
  }
  if (props.showRoom && props.isAdmin)
  {
    return (
      <div className="chat-header-container">
        <img className="profile-image" src={props.profileImageUrl} alt="Friend" />
        <div className="friend-info">
          <div className="friend-name">{props.friendName}</div>
        </div>
        <div className="icons-container">
          <div className='blank'>
          </div>
          <div className='profil'onClick={handleleave} >
            <img title="Leave" src={leave} width='20' height='20' alt="leave" />
          </div>
          {leaveRoom &&
            <div className="leave-box">
              <div className="leave-input">
                <label htmlFor="input"> Are you sure ?</label>
              </div>
              <button onClick={LeaveRoom}>Yes</button>
              <button onClick={handleleave}>No</button>
            </div>
          }
        </div>
      </div>
        );
  }
  else if (props.showDm)
  {
    return (
  <div className="chat-header-container">
    <img className="profile-image" src={props.profileImageUrl} alt="Friend" />
    <div className="friend-info">
      <div className="friend-name">{props.friendName}</div>
    </div>
    <div className="icons-container">
      <div className='game'>
        <img title="invite to game" src={game} alt="Icon1" />
      </div>
      <div className='blank'>
      </div>
      <div className='profil' onClick={UserProfile}>
        <img title="view profile" src={profil} alt="Icon2" />
      </div>
    </div>
  </div>
    );
  }
};

export default ChatHeaderComponent;
