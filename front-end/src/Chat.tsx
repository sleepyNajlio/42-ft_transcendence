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

export function Chat() {
    const [joined, setJoined] = useState(false);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(0);
    const [Rooms, setRooms] = useState<any[]>([]);

    
    const [socket, setSocket] = useState<Socket | null>(null);
    
    useEffect(() => {
        if (!joined) return;
        const newSocket = io('http://localhost:3000/chat', {
            transports: ['websocket'],
        });
        let id : number;
        getUser().then(user => {
            id = Number(user.id_player);
            newSocket.emit('join', { id ,  name},  (response : any[]) => {
                if (!response)
                {
                    alert("room does not exist");
                    setJoined(false);
                }
            });


        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        newSocket.emit('findAllMessages', {name}, (response: any[]) => {
            // console.log("response got in find all: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });

        setSocket(newSocket);
        
        newSocket.on('message', (message) => {
            console.log("from front message " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        // newSocket.on('rooms', (room) => {
        //     console.log("from front rooms: " + room);
        //     setRooms((prevRooms) => [...prevRooms, room]);
        // });

        let username : string;
        getUser().then(user => {
            username = user.username;
            newSocket.on('typing', ({ name:name, username: username, isTyping: isTyping }) => {
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
            newSocket.disconnect();
        };
    }, [joined]);

    useEffect(() => {
        if (!created)
        {
            return;            
        }
        const newSocket = io('http://localhost:3000/chat', {
        transports: ['websocket'],
        });
        let id1 : number;
        getUser().then(user => {
            id1 = Number(user.id_player);
            // if (!socket) return;
            // console.log("id1 in front: " + id1);
            newSocket.emit('createRoom', { id1 ,  name},  (response : any[]) => {
                if (!response)
                    alert("room already exist");
            });
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
        // setSocket(newSocket);
        setCreated(0);
    },[created]);

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

    const changeMessage = (event : any) => {
        typingEmit();
        setMessageText(event.target.value);
    };

    const join = () => {
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
                    <> room 1</>
                    <> room 2</>
                    <> room 3</>
                    
                    {/* {Rooms.map((room, index) => (
                    <button key={index} onClick={join}>{room.name}</button>
                    ))} */}

                
                </div>
                {!joined && (
                    <div className="cin">
                    <input type="text" placeholder='Name' name="name" id="name" value={name} onChange={changeName} />
                    <button onClick={() => join()}>Join</button>
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
                            <input type="text" name="messageText" id="messageText" placeholder='message' value={messageText} onChange={changeMessage} /> 
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

