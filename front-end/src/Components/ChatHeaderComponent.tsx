// ChatHeaderComponent.tsx
import React from 'react';
import { useState } from 'react';
import game from '../assets/PlayIcon.png'
import block from '../assets/BlockIcon.png'
import profil from '../assets/ProfilIcon.png'
import leave from '../assets/fire-exit.png'
import  Setting from '../assets/setting.png';

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
    // Logic to apply changes to the server based on modify, set, or remove password state
    // Call your API endpoints here
    // Reset state or take necessary actions
  };

  console.log("room type in settings : " + props.Roomtype);

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

const ChatHeaderComponent: React.FC = (props : any) => {
  
  const [showSettings, setShowSettings] = useState(false);
  const [leaveRoom, setLeaveRoom] = useState(false);

  const handleSettings = () => {
    setShowSettings(!showSettings);
  }
  const handleleave = () => {
    setLeaveRoom(!leaveRoom);
    // props.handleleave();
  }
  
  if (props.showRoom && !props.isOwner)
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
          <div className='profil'>
            <img src={leave} width='20' height='20' alt="Icon2" />
          </div>
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
            <img src={Setting} width='20' height='20' alt="Settings" />
          </div>
          {showSettings && <SettingsComponent  Roomtype={props.Roomtype} setShowSettings={setShowSettings}
              showSettings={showSettings} handleUpdateRoom={props.handleUpdateRoom}/>}
          <div className='blank'>
          </div>
          <div className='profil' onClick={handleleave}>
            <img src={leave} width='20' height='20' alt="leave" />
          </div>
          {leaveRoom &&
            <div className="leave-box">
              <div className="leave-input">
                <label htmlFor="input"> Are you sure ?</label>
              </div>
              <button onClick={props.handleleave}>Yes</button>
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
  }
};

export default ChatHeaderComponent;
