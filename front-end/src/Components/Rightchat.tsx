import React from 'react';
import { useState } from 'react';
import ftlogo from '/logo-room.png';
import '../styles/css/chatui.css';
import UserInfo from './UserInfo.tsx';
import InboxBox from './InboxBox.tsx';
import Simpleco from './Simpleco.tsx'
import Switchgrpdm from './Switchgrpdm.tsx';

const Rightchat: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="composant-droite">
      <Simpleco text="Chats" />
      <UserInfo onSearch={handleSearch} />
      <Switchgrpdm
        HandleDisplayDms={props.HandleDisplayDms}
        HandleDisplayRoom={props.HandleDisplayRoom}
      />
      {props.DisplayRoom && (
        <div className="messagate">
          <button
            className="filled bt"
            onClick={() => props.setCreating(!props.creating)}
          >
            Create
          </button>
          {props.creating && (
            <div className="sbox" style={{ backgroundColor: '#0f597b' }}>
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
              <select
                value={props.roomType}
                onChange={(e) => props.handleRoomType(e.target.value)}
              >
                <option disabled value="">
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
              <button
                onClick={props.create}
                disabled={
                  !props.name ||
                  (props.roomType !== 'PUBLIC' &&
                    props.roomType !== 'PRIVATE' &&
                    !props.roomPassword)
                }
              >
                Create
              </button>
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