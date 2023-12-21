import Navbar from './Components/Navbar.tsx';
// import Sbox from './Components/Sbox.tsx';
import  './styles/css/chat.css'
// import {io} from "socket.io-client";
import { useState, useEffect, useContext, SetStateAction } from 'react';
// import { Socket } from 'socket.io-client';
import { getUser } from './player';
import { getSocket } from './socket.ts';
import camera from './assets/camera.svg'
import { get } from 'svg.js';
import { UserContext } from './UserProvider.tsx';

import TestChat from './Testchat.tsx';
import Leftchat from './Components/Leftchat.tsx';
import Rightchat from './Components/Rightchat.tsx';
// import '../styles/css/chatui.css';
import UserInfo from './Components/UserInfo.tsx';
import InboxBox from './Components/InboxBox.tsx';
import Simpleco from './Components/Simpleco.tsx'
import Switchgrpdm from './Components/Switchgrpdm.tsx';
import './styles/css/UserInfo.css';
import './styles/css/inboxBox.css';
import './styles/css/Simpleco.css';
import './styles/css/Switchgrpdm.css';
import './styles/css/ChatHeaderComponent.css';

interface userChat {
    userId: number;
    id_chat : number;
    id_chat_user : number;
    role: string;
}

interface Room {
    id: number;
    type: string;
    name: string;
    password: string;
    users: userChat;
}




export function Chat() { // get values from data base
    const [joined, setJoined] = useState(false);
    const { user, socket } = useContext(UserContext);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    // const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(0);
    const [roomType, setRoomType] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [Rooms, setRooms] = useState<Room | null>(null);
    const [Friends, setFriends] = useState<any[]>([])
    // const [socket, setSocket] = useState(getSocket());
    const [creating, setCreating] = useState(false);
    const [selectedPswd, setSelectedPswd] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [joinfriend, setJoinfriend] = useState(false);
    const [ShowDm, setShowDm] = useState(false);
    const [showRoom, setShowRoom] = useState(false);
    const [DisplayRoom, setDisplayRoom] = useState(false);
    const [DisplayDms, setDisplayDms] = useState(false);

    useEffect(() => { 
        if (!joined) return;
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('join', { 
            id , 
            name: selectedRoom?.name,
            type: selectedRoom?.type ,
            selectedPswd
        },  (response : any[]) => {
            console.log("response got in join: ");
            if (!response)
            {
                alert("wrong password");
                setJoined(false);
                setShowRoom(false);
                return;
            }
        });
        socket?.emit('findAllMessages', {name: selectedRoom?.name, id: 0, username: null}, (response: any[]) => {
            // console.log("response got in find alll: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        socket?.on('message', (message) => {
            if (message.chat.name === selectedRoom?.name) {
                console.log("from front message " + message);
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });
        
        // socket?.on('rooms', (room) => {
        //     // console.log("from front rooms: " + room);
        //     setRooms((prevRooms) => [...prevRooms, ...room]);
        // });
        setJoined(false);
        setShowRoom(true);
        // let username : string;
        // getUser().then(user => {
        //     username = user.username;
        //     socket.on('typing', ({ name:name , username: username, isTyping: isTyping }) => {
        //     if (isTyping) {
        //         setTypingDisplay(`${username} is typing...`);
        //     } else {
        //         setTypingDisplay('');
        //     }
        //     });
        // }).catch(error => {
        //     console.error("Failed to get user: ", error);
        // });
        // return () => {
        //     socket.off(`message_${selectedRoom?.id}`);
        // };
    }, [joined]);
    

    useEffect(() => {
        if (!joinfriend) return;
        console.log("use effect called in join friend");
        let id : number;
        let username : string | undefined;
        id = Number(user?.id_player);
        username = user?.username;
        console.log("name in fronttt: " + name)
        socket?.emit('joinDm', { id ,  name: name, username:username},  (response : any[]) => {
            
            console.log("response got in joinDM: ");
            console.log(response);
        });
        socket?.emit('findAllMessages', {name: name, id, username: username}, (response: any[]) => {
            // console.log("response got in find all: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        socket?.on('message', (message) => {
            // console.log("from front message " + message);
            // if (message.user.username === name)
            console.log("the user that should listen to message " + message.user.username);
            console.log("the user that is logged in " + username);
            console.log("the user that the message is send to " + name);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        setShowRoom(false);
        setJoinfriend(false);
        setShowDm(true);
        // return () => {
        //         socket?.disconnect();
        //     };
            
        }, [joinfriend]);
        
    
    const joinDm = (username: string) => {
        socket?.off('message');
        setName(username);
        console.log("username name in front: " + username);
        setShowDm(false);
        setJoinfriend(true);
        // console.log(name);
    }


    useEffect(() => {
        if (!created) return;

        let id1 : number;
        id1 = Number(user?.id_player);
        socket?.emit('createRoom', { id1 ,  name, roomType, roomPassword},  (response : any[]) => {
            if (!response)
                alert("room already exist");
        });
        setShowRoom(true);
        setDisplayRoom(true);
    },[created]);
    
    
    useEffect(() => {
        console.log("use effect called in display room");
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('DisplayRoom', { id },  (response : Room) => {
            // console.log('rooms in display room :')
            // console.log(response);
            setRooms(response);
            // setDisplayDms(false);
            // setDisplayRoom(true);
            // DisplayRooms(response);
        });
        socket?.on('rooms', (Room : Room) => {
            // console.log("from front rooms: " + room);
            setRooms(Room);
        });
    return () => {
    };
    }, [user, DisplayRoom]);

    useEffect(() => {
        console.log("use effect called in show Dms");
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('Friends', { id },  (response : any[]) => {
            console.log(response);
            setFriends(response);
            // setDisplayDms(true);
            // setDisplayRoom(false);

        });
        return () => {
        };
    }, [user, DisplayDms]);

    const HandleDisplayDms = () => {
        setDisplayDms(true);
        setDisplayRoom(false);
    }
    const HandleDisplayRoom = () => {
        setDisplayDms(false);
        setDisplayRoom(true);
    }

    const sendMessage = (messageText: string) => {
        let id: number;
        console.log('send message called ')
        id = Number(user?.id_player);
        socket?.emit('createMessage', {
            name: selectedRoom ? selectedRoom.name : name,
            text: messageText,
            id: id,
            username: null,
        });
    }
    
    const sendMessageDm = (messageText: string) => {

        let id: number;
        let username : string | undefined;
        console.log('message dm called ')
        console.log("name in message dm front: " + name);
        id = Number(user?.id_player);
        username = user?.username;
        socket?.emit('createMessage', {
                name: name,
                text: messageText,
                id: id,
                username: username,
        }, (response : any[]) => {
        });
    }
    
    const DisplayRooms = (rooms: Room) => {
        setRooms(rooms);
    }

    const changeName = (event : any) => {
        setName(event.target.value);
    };
    
    const join = (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonName = event.currentTarget.name;
        setName(buttonName);
        setJoined(true);
    };
    const create = () => {
        setCreated(1);
    };

    const handleRoomType = (type: string) => {
        setRoomType(type);
    };

    const handleRoomPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPassword(event.target.value);
    };
    // for joining room
    const handleRoomClick = (room: Room) => {
        console.log('room clickedddd: ');
        socket?.off('message');
        setShowRoom(false);
        if (room.type === 'PROTECTED') {
          setSelectedRoom(room);
        } else {
            console.log('alooo')
            setSelectedRoom(room);
        }
        setJoined(true);
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        socket?.off('message');
        setSelectedPswd(event.target.value);
        // console.log('selectedPswd in front :' + event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
        console.log('handle join with password front');
        if (selectedRoom) {
          setJoined(true);
        }
    };


    // const typingEmit = () => {
    //     if (!socket) return;
    //     let username : string;
    //     getUser().then(user => {
    //         username = user.username;
    //         socket.emit('typing', { name: name , username: username,isTyping: true });
    //         setTimeout(() => {
    //             socket.emit('typing', {  name: name , username: username,isTyping: false });
    //         }, 2000);
    //     }).catch(error => {
    //         console.error("Failed to get user: ", error);
    //     });
    // };

    return (
        <>
        
            <div className="conteneur">
                <div className="gauche">
                    {showRoom && <Leftchat userid={user?.id_player} showRoom={showRoom}messages={messages} name={selectedRoom?.name} sendMessage={sendMessage}/> }
                    {ShowDm && <Leftchat userid={user?.id_player} showDm={ShowDm} messages={messages} name={name}sendMessageDm={sendMessageDm} Friends={Friends}/> }
                </div>
                <div className="droite">
                    {< Rightchat rooms={Rooms} userId={user?.id_player} handleRoomClick={handleRoomClick} create={create}
                     handleRoomPassword={handleRoomPassword} name={name} roomType={roomType} roomPassword={roomPassword}
                     creating={creating} changeName={changeName} setCreating={setCreating} handleRoomType={handleRoomType}
                     handleSelectedPassword={handleSelectedPassword} handleJoinWithPassword={handleJoinWithPassword}
                     selectedPswd={selectedPswd} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} 
                     Friends={Friends} setDisplayDms={setDisplayDms} setDisplayRoom={setDisplayRoom} DisplayDms={DisplayDms} DisplayRoom={DisplayRoom}
                     HandleDisplayDms={HandleDisplayDms} HandleDisplayRoom={HandleDisplayRoom} joindDm={joinDm}/> }
                </div>
                {/* <div className="chat_header">

                    <button className="filled bt" onClick={()=>setCreating(true)}>Create</button>
                    <h1>Rooms</h1>
                    
                    {Rooms.map((room, index) => (
                    <div key={index}>
                      {room.type === 'PROTECTED' ? (
                        <div>
                          <button onClick={() => handleRoomClick(room)}>{room.name}</button>
                          {selectedRoom && selectedRoom.name === room.name && (
                            <div>
                              <input
                                type="text"
                                placeholder="Enter password"
                                name={`${room.name}`}
                                id={`${room.name}`}
                                value={selectedPswd}
                                onChange={handleSelectedPassword}
                              />
                              <button name={room.name} onClick={handleJoinWithPassword}>Join</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleRoomClick(room)}>{room.name}</button>
                      )}
                    </div> */}
                    {/* ))} */}
                     {/* <h1>Friends</h1>
                    
                    {Friends.map((friend, index) => (
                    <button key={index} name={friend.username} onClick={joinDm}>{friend.username}</button>
                    ))} */}
                    
                </div>

                    {/* {creating && (
                        <div className="sbox">
                        <div className="sbox__input">
                            <label htmlFor="input"> channel name *</label>
                            <input type="text" id="name" name={name} onChange={changeName} placeholder='ex: manini manini'/>
                        </div>
                        <select value={roomType} onChange={(e) => handleRoomType(e.target.value)}>
                            <option disabled value="">Room Type</option>
                             <option value="PUBLIC">Public</option>
                             <option value="PRIVATE">Private</option>
                             <option value="PROTECTED">Protected</option>
                        </select>
                            {(roomType === "PROTECTED") && (
                                <input
                                    type="text"
                                    placeholder="Password"
                                    value={roomPassword}
                                    onChange={handleRoomPassword}
                                />
                                
                            )}
                            <button onClick={create} disabled={!name || (roomType !== "PUBLIC" && roomType !== "PRIVATE" && !roomPassword)}>
                                Create
                            </button>
                        </div>
                    )} */}
                {/* {(showRoom) && (
                    <div className="chat_container">
                        <div className="Message_cnt">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    [{message.user.username}]: {message.message}
                                </div>
                            ))}
                        </div>
                        <div className="cin">
                            <input type="text" name="messagechText" id="messageText" placeholder='message' value={messageText} onChange={changeMessage} onKeyDown={enter} /> 
                            <button onClick={sendMessage}>Send</button>
                        </div>
                        { <div className="typing">
                            {typingDisplay && (<p>{typingDisplay}</p>)}
                        </div> }
                    </div>
                )}
                {(ShowDm) && (
                    <div className="chat_container">
                        <div className="Message_cnt">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    [{message.user.username}]: {message.message}
                                </div>
                            ))}
                        </div>
                        <div className="cin">
                            <input type="text" name="messagedmText" id="messageText" placeholder='message' value={messageText} onChange={changeMessage} onKeyDown={enter} /> 
                            <button onClick={sendMessageDm}>Send</button>
                        </div>
                        { <div className="typing">
                            {typingDisplay && (<p>{typingDisplay}</p>)}
                        </div> }
                    </div>
                )} */}
        </>
    );
}

