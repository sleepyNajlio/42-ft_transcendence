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


interface Room {
    id: number;
    name: string;
    type: string;
    password: string;
}



export function Chat() {
    const [joined, setJoined] = useState(false);
    const { user, socket } = useContext(UserContext);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(0);
    const [roomType, setRoomType] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [Rooms, setRooms] = useState<any[]>([]);
    const [Friends, setFriends] = useState<any[]>([])
    // const [socket, setSocket] = useState(getSocket());
    const [creating, setCreating] = useState(false);
    const [selectedPswd, setSelectedPswd] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [joinfriend, setJoinfriend] = useState(false);
    const [ShowDm, setShowDm] = useState(false);

    // setSocket(getSocket());
    // console.log('sokita: ')
    // console.log(socket);
    
    useEffect(() => {
        if (!joined) return;
        let id : number;
            id = Number(user?.id_player);
            if (selectedRoom)
            {
                if (!socket) return;
                socket.emit('join', { id ,  name: selectedRoom.name, type: selectedRoom.type ,selectedPswd},  (response : any[]) => {
                    
                    // console.log("response got in join: ");
                    // console.log(response);
                    if (!response)
                    {
                        alert("wrong password");
                        setJoined(false);
                    }
                });
            }
        if (selectedRoom)
        {
            if (!socket) return;

            socket.emit('findAllMessages', {name: selectedRoom.name, id: 0, username: null}, (response: any[]) => {
                // console.log("response got in find all: ");
                // console.log(response);
                setMessages(response);
                // console.log(messages);
            });
        }

        if (!socket) return;    
        socket.on('message', (message) => {
            // console.log("from front message " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        socket.on('rooms', (room) => {
            console.log("from front rooms: " + room);
            setRooms((prevRooms) => [...prevRooms, ...room]);
        });
        // setJoined(false);
        // setSelectedRoom(null);

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
        //     socket.disconnect();
        // };
    }, [joined]);
    

    useEffect(() => {
        if (!joinfriend) return;
        console.log("use effect called in join friend");
        let id : number;
        let username : string | undefined;
        id = Number(user?.id_player);
        username = user?.username;
        if (!socket) return;
        console.log("use effect called in join friendininini");
        socket.emit('joinDm', { id ,  name: name, username:username},  (response : any[]) => {
            
            console.log("response got in joinDM: ");
            console.log(response);
        });
        if (!socket) return;
        socket.emit('findAllMessages', {name: name, id, username: username}, (response: any[]) => {
            console.log("response got in find all: ");
            console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        if (!socket) return;
        socket.on('message', (message) => {
            console.log("from front message " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        setJoinfriend(false);
        setShowDm(true);
        // return () => {
            //     socket.disconnect();
            // };
            
        }, [joinfriend]);
        
    
    const joinDm = (event: React.MouseEvent<HTMLButtonElement>) => {
        socket?.off('message');
        const buttonName = event.currentTarget.name;
        setName(buttonName);
        setShowDm(false);
        setJoinfriend(true);
        // console.log(name);
    }


    useEffect(() => {
        if (!created)
        {
            return;            
        }

        let id1 : number;
        id1 = Number(user?.id_player);

            // if (!socket) return;
            // console.log("id1 in front: " + id1);
            if (!socket) return;
            socket.emit('createRoom', { id1 ,  name, roomType, roomPassword},  (response : any[]) => {
                if (!response)
                    alert("room already exist");
            });
        // setSocket(socket);
        // setCreated(0);
    },[created]);
    
    
    useEffect(() => {
        // Code to run when the component is mounted
        console.log('useEffect called');
        console.log(user);
        let id : number;
                id = Number(user?.id_player);
            // console.log('dkhel hna');
            if (!socket) return;
            socket.emit('DisplayRoom', { id },  (response : any[]) => {
                setRooms(response);
                // console.log('rooms got in front: ')
                // console.log(response);
            });
    return () => {
    };
    }, [user]);

    useEffect(() => {
        let id : number;
            id = Number(user?.id_player);
            if (!socket) return;
            socket.emit('Friends', { id },  (response : any[]) => {
                // console.log('users got in front: ')
                // console.log(response);
                setFriends(response);
            });
        return () => {
        };
    }, [user]);

    const sendMessage = () => {
        let id: number;
        console.log('send message called ')
        id = Number(user?.id_player);
        if (!socket) return;
        socket.emit('createMessage', {
            name: selectedRoom ? selectedRoom.name : name,
            text: messageText,
            id: id,
            username: null,
        });
        }
    
    const sendMessageDm = () => {

        let id: number;
        let username : string | undefined;
        console.log('message dm called ')
        console.log("name in front: " + name);

        id = Number(user?.id_player);
        username = user?.username;
        if (!socket) return;
        socket.emit('createMessage', {
                name: name,
                text: messageText,
                id: id,
                username: username,
        }, (response : any[]) => {
        });
    }
    
    const changeName = (event : any) => {
        setName(event.target.value);
    };

    const enter = (event : any) => {
        if (event.key === 'Enter') {
            if (ShowDm)
                sendMessageDm();
            else
                sendMessage();
        }
    }
    const changeMessage = (event : any) => {
        // typingEmit();
        setMessageText(event.target.value);
    };

    const join = (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonName = event.currentTarget.name;
        setName(buttonName);
        setJoined(true);
        // console.log(name);
    };
    const create = () => {
        setCreated(1);
        // console.log(name);
    };

    // const handleCreateRoom = () => {
    //     setCreated(1);
    // };
    // for creating room
    const handleRoomType = (type: string) => {
        setRoomType(type);
    };

    const handleRoomPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPassword(event.target.value);
    };
    // for joining room
    const handleRoomClick = (room: Room) => {
        if (room.type === 'PROTECTED') {
          setSelectedRoom(room);
        } else {
            setSelectedRoom(room);
            setJoined(true); // Join directly for public rooms
        }
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPswd(event.target.value);
        // console.log('selectedPswd in front :' + event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
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
            <div className="chat">
                <div className="chat_header">

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
                    </div>
                    ))}
                     <h1>Friends</h1>
                    
                    {Friends.map((friend, index) => (
                    <button key={index} name={friend.username} onClick={joinDm}>{friend.username}</button>
                    ))}
                    
                </div>

                    {creating && (
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
                    )}
                {(joined) && (
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
                        {/* <div className="typing">
                            {typingDisplay && (<p>{typingDisplay}</p>)}
                        </div> */}
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
                        {/* <div className="typing">
                            {typingDisplay && (<p>{typingDisplay}</p>)}
                        </div> */}
                    </div>
                )}

                
            </div>
        </>
    );
}

