import React from 'react';
import '../styles/css/chatui.css';
import UserInfo from './UserInfo.tsx';
import InboxBox from './InboxBox.tsx';
import Simpleco from './Simpleco.tsx'
import Switchgrpdm from './Switchgrpdm.tsx';

const Rightchat: React.FC = (props: any) => {
  console.log("right chat called ");
  // console.log("friends in right chat : ", props.Friends);
  // console.log("rooms in right chat : ", props.rooms);
    return (
      <div className="composant-droite">
        <Simpleco text="Chats"/>
        <UserInfo />
        <Switchgrpdm HandleDisplayDms={props.HandleDisplayDms} 
             HandleDisplayRoom={props.HandleDisplayRoom}/>
        {props.DisplayRoom && (
        <div className='messagate'>
          <button className="filled bt" onClick={()=>props.setCreating(true)}>Create</button>
            {props.rooms.map((room:any) => (
              
              <InboxBox  room={room} DisplayRoom={props.DisplayRoom} userId={props.userId}handleRoomClick={props.handleRoomClick} handleSelectedPassword={props.handleSelectedPassword} 
                 message={room.message} handleJoinWithPassword={props.handleJoinWithPassword}
                 selectedRoom={props.selectedRoom} setSelectedRoom={props.setSelectedRoom} />
            ))}
             {props.creating && (
                          <div className="sbox" style={{ backgroundColor: '#0f597b' }}>
  
                          <div className="sbox__input">
                              <label htmlFor="input"> channel name *</label>
                              <input type="text" id="name" name={props.name} onChange={props.changeName} placeholder='ex: manini manini'/>
                          </div>
                          <select value={props.roomType} onChange={(e) => props.handleRoomType(e.target.value)}>
                              <option disabled value="">Room Type</option>
                               <option value="PUBLIC">Public</option>
                               <option value="PRIVATE">Private</option>
                               <option value="PROTECTED">Protected</option>
                          </select>
                              {(props.roomType === "PROTECTED") && (
                                  <input
                                      type="text"
                                      placeholder="Password"
                                      value={props.roomPassword}
                                      onChange={props.handleRoomPassword}
                                  />
                                  
                              )}
                              <button onClick={props.create} disabled={!props.name || (props.roomType !== "PUBLIC" && props.roomType !== "PRIVATE" && !props.roomPassword)}>
                                  Create
                              </button>
                          </div>
                      )}
            </div>
          )}
          {props.DisplayDms && (
            <div className='messagate'>
              {props.Friends.map((friend:any) => (
                <InboxBox friend={friend} userId={props.userId} DisplayDms={props.DisplayDms} joindDm={props.joindDm} />
              ))}
            </div>
          )}

          </div>

    );
  ;
    }
export default Rightchat;