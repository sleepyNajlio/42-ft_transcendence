import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/chat.css'
import {io} from "socket.io-client";
import { SetStateAction, useEffect } from 'react';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { Profile } from './Profile.tsx';
import { getUser } from './player';
import { get } from 'svg.js';
import { KeyboardEvent } from 'react';
import { getSocket } from './socket.ts';

export function Chat() {
    const [joined, setJoined] = useState(false);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(0);
    const [Rooms, setRooms] = useState<any[]>([]);
    const [Freinds, setFriends] = useState<any[]>([])

    
    const [socket, setSocket] = useState(getSocket());

    // setSocket(getSocket());
    // console.log('sokita: ')
    // console.log(socket);
    
    useEffect(() => {
        if (!joined) return;
        let id : number;
        getUser().then(user => {
            id = Number(user.id_player);
            socket.emit('join', { id ,  name},  (response : any[]) => {
                if (!response)
                {
                    alert("room does not exist");
                    setJoined(false);
                }
            });


        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        socket.emit('findAllMessages', {name}, (response: any[]) => {
            // console.log("response got in find all: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });

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
            socket.on('typing', ({ name:name, username: username, isTyping: isTyping }) => {
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
        if (!created)
        {
            return;            
        }

        let id1 : number;
        getUser().then(user => {
            id1 = Number(user.id_player);
            // if (!socket) return;
            // console.log("id1 in front: " + id1);
            socket.emit('createRoom', { id1 ,  name},  (response : any[]) => {
                if (!response)
                    alert("room already exist");
            });
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        // setSocket(socket);
        setCreated(0);
    },[created]);

    
    useEffect(() => {
        // Code to run when the component is mounted
        getUser().then(user => {
            let id = Number(user.id_player);
            // console.log('dkhel hna');
            socket.emit('DisplayRoom', { id },  (response : any[]) => {
                setRooms(response);
            });
        }).catch(err => {
            console.error("Failed to get rooms from user: ", err);
        });
    return () => {
    };
    }, []);

    useEffect(() => {
            console.log('dkhel hna');
            socket.emit('Friends', (response : any[]) => {
                console.log('users got in front: ')
                console.log(response);
                setFriends(response);
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
                    name: name,
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

    // ...
    const typingEmit = () => {
        if (!socket) return;
        let username : string;
        getUser().then(user => {
            username = user.username;
            socket.emit('typing', { name:name, username: username,isTyping: true });
            setTimeout(() => {
                socket.emit('typing', { name:name, username: username,isTyping: false });
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

                    <h1>Rooms</h1>
                    
                    {Rooms.map((room, index) => (
                    <button key={index} name={room.name} onClick={join}>{room.name}</button>
                    ))}
                     <h1>Friends</h1>
                    
                    {Freinds.map((friend, index) => (
                    <button key={index} name={friend.username} onClick={join}>{friend.username}</button>
                    ))}
                    
                </div>
                {!joined && (
                    <div className="cin">
                    <input type="text" placeholder='Name' name="name" id="name" value={name} onChange={changeName} />
                    <button name={name} onClick={join}>Join</button>
                    <button onClick={() => create()}>create</button>
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

