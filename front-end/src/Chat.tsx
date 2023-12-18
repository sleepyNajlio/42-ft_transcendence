import Navbar from './Components/Navbar.tsx';
// import Sbox from './Components/Sbox.tsx';
import  './styles/css/chat.css'
// import {io} from "socket.io-client";
import { useState, useEffect, SetStateAction } from 'react';
// import { Socket } from 'socket.io-client';
import { getUser } from './player';
import { getSocket } from './socket.ts';
import camera from './assets/camera.svg'
import { get } from 'svg.js';

interface Room {
    id: number;
    name: string;
    type: string;
    password: string;
}



export function Chat() {
    const [joined, setJoined] = useState(false);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(0);
    const [roomType, setRoomType] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [Rooms, setRooms] = useState<any[]>([]);
    const [Friends, setFriends] = useState<any[]>([])
    const [socket, setSocket] = useState(getSocket());
    const [creating, setCreating] = useState(false);
    const [selectedPswd, setSelectedPswd] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [joinfriend, setJoinfriend] = useState(false);

    // setSocket(getSocket());
    // console.log('sokita: ')
    // console.log(socket);
    
    useEffect(() => {
        if (!joined) return;
        let id : number;
        getUser().then(user => {
            id = Number(user.id_player);
            if (selectedRoom)
            {
                socket.emit('join', { id ,  name: selectedRoom.name, type: selectedRoom.type ,selectedPswd},  (response : any[]) => {
                    
                    console.log("response got in join: ");
                    console.log(response);
                    if (!response)
                    {
                        alert("wrong password");
                        setJoined(false);
                    }
                });
            }


        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        if (selectedRoom)
        {
            socket.emit('findAllMessages', {name: selectedRoom.name}, (response: any[]) => {
                // console.log("response got in find all: ");
                // console.log(response);
                setMessages(response);
                // console.log(messages);
            });
        }

        setSocket(socket);
        
        socket.on('message', (message) => {
            console.log("from front message " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        socket.on('rooms', (room) => {
            console.log("from front rooms: " + room);
            setRooms((prevRooms) => [...prevRooms, ...room]);
        });

        let username : string;
        getUser().then(user => {
            username = user.username;
            socket.on('typing', ({ name:name , username: username, isTyping: isTyping }) => {
            if (isTyping) {
                setTypingDisplay(`${username} is typing...`);
            } else {
                setTypingDisplay('');
            }
            });
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        return () => {
            socket.disconnect();
        };
    }, [joined]);

    useEffect(() => {
        if (!joinfriend) return;
        let id : number;
        let username : string;
        getUser().then(user => {
            id = Number(user.id_player);
            username = user.username;
            if (name){
                socket.emit('joinDm', { id ,  name: name, username:username},  (response : any[]) => {
                    
                    console.log("response got in join: ");
                    console.log(response);
                    // if (!response)
                    // {
                    //     alert("wrong password");
                    //     setJoined(false);
                    // }
                });
            }


        }).catch(error => {
            console.error("Failed to get user: ", error);
        });




    }, [joinfriend]);

    const joinDm = (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonName = event.currentTarget.name;
        setName(buttonName);
        setJoinfriend(true);
        // console.log(name);
    }


    useEffect(() => {
        if (!created)
        {
            return;            
        }

        let id1 : number;
        getUser().then(user => {
            id1 = Number(user.id_player);
            // if (!socket) return;
            // console.log("id1 in front: " + id1);
            socket.emit('createRoom', { id1 ,  name, roomType, roomPassword},  (response : any[]) => {
                if (!response)
                    alert("room already exist");
            });
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        // setSocket(socket);
        // setCreated(0);
    },[created]);

    
    useEffect(() => {
        // Code to run when the component is mounted
        getUser().then(user => {
            let id = Number(user.id_player);
            // console.log('dkhel hna');
            socket.emit('DisplayRoom', { id },  (response : any[]) => {
                setRooms(response);
                console.log('rooms got in front: ')
                console.log(response);
            });
        }).catch(err => {
            console.error("Failed to get rooms from user: ", err);
        });
    return () => {
    };
    }, []);

    useEffect(() => {
            getUser().then(user => {
                let id = Number(user.id_player);
                socket.emit('Friends', { id },  (response : any[]) => {
                    console.log('users got in front: ')
                    // console.log(response);
                    setFriends(response);
                });
            }
        ).catch(err => {
            console.error("Failed to get friends from user: ", err);
        });
        return () => {
        };
    }, []);

    const sendMessage = () => {
        let id: number;
        getUser()
            .then(user => {
                id = Number(user.id_player);
                console.log("sent from front: " + id);
                if (!socket) return;
                socket.emit('createMessage', {
                    name: selectedRoom ? selectedRoom.name : name,
                    text: messageText,
                    id: id,
                });
            })
            .catch(error => {
                console.error("Failed to get user: ", error);
            });
    };


    const changeName = (event : any) => {
        setName(event.target.value);
    };

    const enter = (event : any) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }
    const changeMessage = (event : any) => {
        typingEmit();
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
          setJoined(true); // Join directly for public rooms
          setSelectedRoom(room);
        }
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPswd(event.target.value);
        console.log('selectedPswd in front :' + event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
        if (selectedRoom) {
          setJoined(true);
        }
    };


    const typingEmit = () => {
        if (!socket) return;
        let username : string;
        getUser().then(user => {
            username = user.username;
            socket.emit('typing', { name: name , username: username,isTyping: true });
            setTimeout(() => {
                socket.emit('typing', {  name: name , username: username,isTyping: false });
            }, 2000);
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
    };

    return (
        <>
            <Navbar/>
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

                    {/* {!joined &&!creating && (
                        <div className="cin">
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                id="name"
                                value={name}
                                onChange={changeName}
                            />
                            <button name={name} onClick={join}>
                                Join
                            </button>
                        </div>
                    )} */}

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
                {joined && (
                    <div className="chat_container">
                        <div className="Message_cnt">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    [{message.user.username}]: {message.message}
                                </div>
                            ))}
                        </div>
                        <div className="cin">
                            <input type="text" name="messageText" id="messageText" placeholder='message' value={messageText} onChange={changeMessage} onKeyDown={enter} /> 
                            <button onClick={sendMessage}>Send</button>
                        </div>
                        <div className="typing">
                            {typingDisplay && (<p>{typingDisplay}</p>)}
                        </div>
                    </div>
                )}
                
            </div>
        </>
    );
}

