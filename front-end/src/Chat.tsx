import  './styles/css/chat.css'
import { useState, useEffect, useContext} from 'react';
import { UserContext } from './UserProvider.tsx';
import Leftchat from './Components/Leftchat.tsx';
import Rightchat from './Components/Rightchat.tsx';
import './styles/css/UserInfo.css';
import './styles/css/inboxBox.css';
import './styles/css/Simpleco.css';
import './styles/css/Switchgrpdm.css';
import './styles/css/ChatHeaderComponent.css';
import { off } from '@svgdotjs/svg.js';

interface userChat {
    userId: number;
    id_chat : number;
    id_chat_user : number;
    role: string;
}

interface Room {
    [x: string]: any;
    id: number;
    type: string;
    name: string;
    password: string;
    users: userChat;
    // lastMessage: string;
}

export function Chat() { // get values from data base
    const [joined, setJoined] = useState(false);
    const { user, socket } = useContext(UserContext);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [typingDisplay, setTypingDisplay] = useState('');
    const [created, setCreated] = useState(false);
    const [roomType, setRoomType] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [Rooms, setRooms] = useState<Room[] | null>(null);
    const [Friends, setFriends] = useState<any[]>([])
    const [creating, setCreating] = useState(false);
    const [selectedPswd, setSelectedPswd] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [joinfriend, setJoinfriend] = useState(false);
    const [ShowDm, setShowDm] = useState(false);
    const [showRoom, setShowRoom] = useState(false);
    const [DisplayRoom, setDisplayRoom] = useState(false);
    const [DisplayDms, setDisplayDms] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [RoomId, setRoomId] = useState(0);

    useEffect(() => { 
        if (!joined || !selectedRoom) return;
        console.log("use effect called in join : ");
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('join', { 
            id , 
            name: selectedRoom?.name,
            type: selectedRoom?.type ,
            selectedPswd
        },  (response : any[]) => {
            // console.log("response got in join: ");
            if (!response)
            {
                // alert("wrong password");
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
            // console.log("the room id state is : " + RoomId);
            // console.log("id chat of the message is: " + message.chat.id_chat + " and selected room id is: " + selectedRoom?.id_chat);
            if (message.chat.id_chat === selectedRoom?.id_chat) {
                // console.log("from front room message ");
                // console.log(message);
                // setJoined(false);
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });
        
        // socket?.on('rooms', (room) => {
            //     // console.log("from front rooms: " + room);
            //     setRooms((prevRooms) => [...prevRooms, ...room]);
            // });
            setJoined(false);
            setShowRoom(true);
            return () => {
            // socket?.off('message');
            // setJoined(false);
        }
    }, [joined, selectedRoom]);
    

    useEffect(() => {
        if (!joinfriend) return;
        // console.log("use effect called in join friend");
        let id : number;
        let username : string | undefined;
        id = Number(user?.id_player);
        username = user?.username;
        // console.log("name in fronttt: " + name)
        socket?.emit('joinDm', { id ,  name: name, username:username},  (response : any[]) => {
            
            // console.log("response got in joinDM: ");
            // console.log(response);
        });
        socket?.emit('findAllMessages', {name: name, id, username: username}, (response: any[]) => {
            // console.log("response got in find all: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        socket?.on('message', (message) => {
            console.log("id chat of the message is: ");
            // console.log(message);
            if ((message.user.username === username || message.user.username === name) && message.chat.name ===  null && message.chat.type === 'PRIVATE')
            {
                console.log("messageDmmm in front : ");
                console.log(message);
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });
        setShowRoom(false);
        setJoinfriend(false);
        setShowDm(true);
        // return () => {
        //     socket?.off('message');
        // }
        }, [joinfriend]);
        
    
    const joinDm = (username: string) => {
            console.log("message off in joinDm : ");
        socket?.off('message');
        setName(username);
        // console.log("username name in front: " + username);
        setShowDm(false);
        setJoinfriend(true);
        // console.log(name);
    }


    useEffect(() => {
        if (!created) return;

        let id1: number;
        id1 = Number(user?.id_player);
        socket?.emit('createRoom', { id1, name, roomType, roomPassword }, (response: any[]) => {
            if (!response)
                alert("room already exist");
        });
        // socket?.off('rooms');
        // socket?.on('rooms', (room) => {
        //     setRooms((prevRooms: Room[] | null) => {
        //         if (prevRooms === null) {
        //             return [room];
        //         }
        //         return [...prevRooms, room];
        //     });
        // });
        setIsOwner(true);
        setDisplayRoom(true);
        return () => {
            // socket?.off('rooms');
            // setCreated(false);
        }
        
        
    },[created]);
    
    
    useEffect(() => {
        console.log("use effect called in display room");
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('DisplayRoom', { id },  (response : Room[]) => {
            // console.log('rooms in display room :')
            // console.log(response);
            setRooms(response);
            // setIsOwner(true);
            // setDisplayDms(false);
            // setDisplayRoom(true);
            // DisplayRooms(response);
        });
        
            socket?.on('rooms', (room) => {
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                        return [room];
                    }
                    return [...prevRooms, room];
                });
            });
            // setDisplayDms(true);
            // setDisplayDms(false);
    return () => {
        socket?.off('rooms');
    };
    }, [user, DisplayRoom]);

    useEffect(() => {
        // console.log("use effect called in show Dms");
        let id : number;
        id = Number(user?.id_player);
        socket?.emit('Friends', { id },  (response : any[]) => {
            // console.log('friends in show Dms :')
            // console.log(response);
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
        console.log("handle display room called");
        // socket?.off('rooms');
        setDisplayDms(false);
        setDisplayRoom(true);
    }

    const sendMessage = (messageText: string) => {
        let id: number;
        // console.log('send message called ')
        id = Number(user?.id_player);
        socket?.emit('createMessage', {
            name: selectedRoom ? selectedRoom.name : name,
            text: messageText,
            id: id,
            username: null,
        });
    }

    // const UpdateRooms = (room: Room) => {
    //     setRooms((prevRooms: Room[] | null) => {
    //         if (prevRooms === null) {
    //             return [room];
    //         }
    //         return [...prevRooms, room];
    //     });
    // }
    const handleUpdateRoom = (newPass : string, modifypass : boolean, setPass : boolean, removepass : boolean) => {

        socket?.emit('updateRoom', {id: user?.id_player, name: selectedRoom?.name, type: selectedRoom?.type, newPass: newPass, modifypass: modifypass, setPass: setPass, removepass: removepass }, (response: Room[]) => {
            console.log("response got in update room: ");
            setRooms(response);
            // UpdateRooms(response);
            // setSelectedRoom(response);
        });
        socket?.on('rooms', (room) => {
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return [room];
                }
                return [...prevRooms, room];
            });
        });        
        // HandleDisplayRoom();
        // setSelectedRoom(selectedRoom);
            
        // });
    }
    
    const sendMessageDm = (messageText: string) => {

        let id: number;
        let username : string | undefined;
        // console.log('message dm called ')
        // console.log("name in message dm front: " + name);
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
    
    const DisplayRooms = (rooms: Room[]) => {
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
        setDisplayDms(true);
        setDisplayDms(false);
        setDisplayRoom(false);
        setCreated(!created);
        setCreating(false);
    };

    const handleRoomType = (type: string) => {
        setRoomType(type);
    };

    const handleRoomPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPassword(event.target.value);
    };
    // for joining room
    const handleRoomClick = (room: Room) => {
        socket?.off('message');
        // console.log('room clickedddd with :');
        // console.log(room.id_chat);
        // setRoomId(room.id_chat);
        if (room.id_chat !== selectedRoom?.id_chat)
            setSelectedRoom(room);
        if (room.chatUser && room.chatUser.role === 'OWNER') {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        // console.log("then is joined is set to true");
        // if (!joined) 
        setJoined(true);
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        socket?.off('message');
        setSelectedPswd(event.target.value);
        // console.log('selectedPswd in front :' + event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
        // console.log('handle join with password front');
        setShowRoom(false);
        if (selectedPswd === selectedRoom?.password) {
            setDisplayDms(true);
            setDisplayDms(false);
            setDisplayRoom(true);
            // setDisplayDms(false);
            setJoined(true);
            // setDisplayRoom(true);
        }
        else
        {
            // setDisplayRoom(false);
            alert("wrong password");
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
                    {showRoom && <Leftchat userid={user?.id_player} showRoom={showRoom}messages={messages} name={selectedRoom?.name} sendMessage={sendMessage} isOwner={isOwner}
                     Roomtype={selectedRoom?.type} handleUpdateRoom={handleUpdateRoom} HandleDisplayRoom={HandleDisplayRoom} DisplayRoom={DisplayRoom}/> }
                    {ShowDm && <Leftchat userid={user?.id_player} showDm={ShowDm} messages={messages} name={name}sendMessageDm={sendMessageDm} Friends={Friends}/> }
                </div>
                <div className="droite">
                    {< Rightchat rooms={Rooms} userId={user?.id_player} id={user?.id_player} handleRoomClick={handleRoomClick} create={create}
                     handleRoomPassword={handleRoomPassword} name={name} roomType={roomType} roomPassword={roomPassword}
                     creating={creating} changeName={changeName} setCreating={setCreating} handleRoomType={handleRoomType}
                     handleSelectedPassword={handleSelectedPassword} handleJoinWithPassword={handleJoinWithPassword}
                     selectedPswd={selectedPswd} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} 
                     Friends={Friends} setDisplayDms={setDisplayDms} setDisplayRoom={setDisplayRoom} DisplayDms={DisplayDms} DisplayRoom={DisplayRoom}
                     HandleDisplayDms={HandleDisplayDms} HandleDisplayRoom={HandleDisplayRoom} joindDm={joinDm}
                     messages={messages} isOwner={isOwner} />}
                </div>            
                </div>
        </>
    );
}

