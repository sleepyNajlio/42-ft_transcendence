import React from 'react';
import { useState } from 'react';
import ftlogo from '/logo-room.png';
import '../styles/css/chatui.css';
import UserInfo from './UserInfo.tsx';
import InboxBox from './InboxBox.tsx';
import Simpleco from './Simpleco.tsx'
import Switchgrpdm from './Switchgrpdm.tsx';
import Button from './Button.tsx';
import SwitchMode from './SwitchMode.tsx';
import { useEffect } from 'react';
import { useRef } from 'react';

const Rightchat: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const divRef = useRef<HTMLDivElement | null>(null);;
  // const [darkMode, setDarkMode] = useState(false);

  const lightModeClass = "light-mode";
  const darkModeClass = "dark-mode";

  // console.log("Messages isssss : ", props.messages);

  // const MessageRef = useRef(null);

  const handleSearch = (query : any) => {
    setSearchQuery(query);
  };

  const filteredRooms = searchQuery
    ? props.rooms.filter((room : any) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : props.rooms;

    const filteredFriends = searchQuery
    ? props.Friends.filter((friend : any) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : props.Friends;

    useEffect(() => {
      const handleClickOutside = (event : MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
          // Click outside the div, close or hide the div
          // You can add your logic to close the div here
          props.setCreating(false);
        }
      };
  
      // Attach the event listener to the document
      document.addEventListener('mousedown', handleClickOutside);
  
      // Cleanup the event listener when the component is unmounted
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={`composant-droite ${props.darkMode ? darkModeClass : lightModeClass}`}>
      <Simpleco text="Chats" />
      <UserInfo onSearch={handleSearch} />
      <Switchgrpdm
        HandleDisplayDms={props.HandleDisplayDms}
        HandleDisplayRoom={props.HandleDisplayRoom}
        setCreating={props.setCreating}
        creating={props.creating}
        DisplayRoom={props.DisplayRoom}
      />
      {props.DisplayRoom && (
        <div className="messagate">
          {props.creating && (
            <div className="createPop">
              <div className="sbox" ref={divRef} style={{ backgroundColor: '#0f597b' }}>
                <div className="sbox__input">
                  <label htmlFor="input"> channel name *</label>
                  <input
                    type="text"
                    id="name"
                    name={props.name}
                    onChange={props.changeName}
                    placeholder="ex: manini manini"
                  />
                </div>
                <select className="room-type-select"
                  value={props.roomType}
                  onChange={(e) => props.handleRoomType(e.target.value)}
                >
                  <option disabled value="" className='disabled-option'>
                    Room Type
                  </option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="PROTECTED">Protected</option>
                </select>
                {props.roomType === 'PROTECTED' && (
                  <input
                    type="text"
                    placeholder="Password"
                    value={props.roomPassword}
                    onChange={props.handleRoomPassword}
                  />
                )}
                <Button
                disabled={
                  !props.name ||
                  (props.roomType !== 'PUBLIC' &&
                    props.roomType !== 'PRIVATE' &&
                    !props.roomPassword)
                }
                  link="#"
                  msg="Create"
                  onClick={props.create}
                  value="Create"
                />
              </div>
            </div>
          )}
          {filteredRooms.map((room: any, index: any) => (
            <InboxBox
              key={index}
              id={props.id}
              room={room}
              DisplayRoom={props.DisplayRoom}
              userId={props.userId}
              handleRoomClick={props.handleRoomClick}
              handleSelectedPassword={props.handleSelectedPassword}
              message={room.message}
              passjoin={props.passjoin}
              handleJoinWithPassword={props.handleJoinWithPassword}
              selectedRoom={props.selectedRoom}
              lastMessage={props.lastMessage}
              isOwner={props.isOwner}
              setSelectedRoom={props.setSelectedRoom}
            />
          ))}
        </div>
      )}
      {props.DisplayDms && (
        <div className="messagate">
          {filteredFriends.map((friend: any, index: any) => (
            <InboxBox
              key={index}
              friend={friend}
              userId={props.userId}
              DisplayDms={props.DisplayDms}
              joindDm={props.joindDm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rightchat;