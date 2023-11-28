import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/main.css'
import {io} from "socket.io-client";
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Socket } from 'socket.io-client';

export function Chat() { // get values from data base
    const [joined, setJoined] = useState(false);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [typingDisplay, setTypingDisplay] = useState('');

    
    const [socket, setSocket] = useState<Socket | null>(null);
    
    useEffect(() => {     // main useeffect function
        if (!joined) return;
        const newSocket = io('http://localhost:3000/chat');
        newSocket.emit('join', { user: name }, () => {
        });
        newSocket.emit('findAllMessages', {}, (response) => {
            setMessages(response);
        });
        setSocket(newSocket);
        
        newSocket.on('message', (message) => {
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        newSocket.on('typing', ({ user: name, isTyping: isTyping }) => {
        console.log(name, isTyping);
        if (isTyping) {
            setTypingDisplay(`${name} is typing...`);
        } else {
            setTypingDisplay('');
        }
        });
        return () => {
            newSocket.disconnect();
        };
    }, [joined]); // "if joined changes value : this func is recalled"


    const sendMessage = () => {      // la sift msg
        if (!socket) return;
        socket.emit('createMessage', {
            name: name,
            text: messageText,
        });
        setMessageText('');
    };


    const changeName = (event : any) => {  // set name fisrt time
        setName(event.target.value);
    };

    const changeMessage = (event : any) => {  // 
        typingEmit();
        setMessageText(event.target.value);
    };

    const join = () => {   //boolean that switch between joined or not
        setJoined(true);
        // console.log(name);
    };

    // ...

    const typingEmit = () => {   // 
        if (!socket) return;
        socket.emit('typing', { isTyping: true }); // emit method send event to server if user is typing
        setTimeout(() => {
            socket.emit('typing', { isTyping: false });
        }, 2000);
    };

    return (    // front-end khdam !
        <>
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
                                    [{message.name}]: {message.text}
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