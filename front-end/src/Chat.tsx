import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/main.css'
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

    
    const [socket, setSocket] = useState<Socket | null>(null);
    
    useEffect(() => {
        if (!joined) return;
        const newSocket = io('http://localhost:3000/chat', {
            transports: ['websocket'],
        });
        let id : number;
        getUser().then(user => {
            id = Number(user.id_player);
            newSocket.emit('join', { id ,  name},  () => {
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
            // console.log("from front " + message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        let username : string;
        getUser().then(user => {
            username = user.username;
            console.log("username in frontttt: " + username);
            newSocket.on('typing', ({ username: username, isTyping: isTyping }) => {
            console.log(username, isTyping);
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
                    id: id
                // }, (response: any[]) => {
                //     console.log("response got in create message: ");
                //     console.log(response);
                //     setMessages(response);
                //     // console.log(messages);
                // });
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

    // ...
    const typingEmit = () => {
        if (!socket) return;
        let username : string;
        getUser().then(user => {
            username = user.username;
            // console.log("username in frontttt: " + username);
            socket.emit('typing', { username: username,isTyping: true });
            setTimeout(() => {
                socket.emit('typing', { username: username,isTyping: false });
            }, 2000);
        }).catch(error => {
            console.error("Failed to get user: ", error);
        });
    };

    return (
        <>
            <Navbar/>
            <div className="chat">
                {!joined && (
                    <div className="cin">
                        <input type="text" placeholder='Name' name="name" id="name" value={name} onChange={changeName} />
                        <button onClick={join}>Join</button>
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