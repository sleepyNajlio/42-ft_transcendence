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
import { user } from './Components/types.ts';

interface User {
    id: number;
    username: string;
    avatar: string;
}

interface userChat {
    userId: number;
    id_chat : number;
    id_chat_user : number;
    role: string;
    user: User;
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
    const [lastMessage, setLastMessage] = useState("");
    const [showT, setShowT] = useState(false);
    const [welcomeMsg, setwelcomeMsg] = useState(!(showRoom || ShowDm || DisplayDms || DisplayRoom));
    const [passjoin, setPassjoin] = useState(true);
    const [chatUsers, setChatUsers] = useState<userChat | null>(null);



    // const handlejoinpass = () => {
    //   setPassjoin(!passjoin);
    // }
    // const [shouldShowTriangle, setShouldShowTriangle] = useState(false);


    // save the states in local storage
    useEffect(() => { 
        if (!joined || !selectedRoom) return;

        console.log("use effect called in join with rooms : ");
        console.log(Rooms);
        let id : number;
        id = Number(user?.id);
        socket?.emit('join', { 
            id , 
            name: selectedRoom?.name,
            type: selectedRoom?.type ,
            selectedPswd: selectedRoom?.password,
        },  (response : any[]) => {
            if (!response)
            {

                // setJoined(false);
                // setSelectedPswd("");
                setShowRoom(false);
                return;
                // setwelcomeMsg(true);
                // alert("Wrong password-")
                // return;
            }
        });
        socket?.emit('findAllMessages', {name: selectedRoom?.name, id: 0, username: null}, (response: any[]) => {
            // console.log("response got in find alll: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        socket?.on('message', (message) => {
            if (message.chat.id_chat === selectedRoom?.id_chat) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
                setRooms((prevRooms) => {
                    if (prevRooms === null) {
                        return null;
                    }
                    const updatedRooms = prevRooms.map((room) => {
                        if (room.id_chat === message.chatId) {
                            return {
                                ...room,
                                lastMessage: room.lastMessage
                                    ? {
                                          ...room.lastMessage,
                                          message: message.message,
                                          user: {
                                              ...room.lastMessage.user,
                                              username: message.user.username,
                                          },
                                      }
                                    : {
                                          message: message.message,
                                          user: {
                                              username: message.user.username,
                                          },
                                      },
                            };
                        }
                        return room;
                    });
                    return updatedRooms;
                });
        });

            setJoined(false);
            setShowRoom(true);
            setwelcomeMsg(false);
            setDisplayRoom(true);
            // selectedPswd && setSelectedPswd("");
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
        id = Number(user?.id);
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
            setFriends((prevFriends) => {
                const updatedFriends = prevFriends.map((friend) => {
                    if (friend.username === message.user.username || friend.username === message.user.username) {
                        return {
                            ...friend,
                            lastMessage: {
                                message: message.message,
                                user: {
                                    username: message.user.username,
                                },
                            },
                        };
                    }
                    return friend;
                });
                return updatedFriends;
            });
        });
        setShowRoom(false);
        setJoinfriend(false);
        setShowDm(true);
        setwelcomeMsg(false);
        // setShowT(false);
        // return () => {
        //     socket?.off('message');
        // }
        }, [joinfriend]);
        
    
    const joinDm = (username: string) => {
            console.log("message off in joinDm : ");
        socket?.off('message');
        setName(username);
        // console.log("username name in front: " + username);
        // setShowDm(false);
        setJoinfriend(true);
        // setShowT(false);
        // console.log(name);
    }


    useEffect(() => {
        if (!created) return;

        let id1: number;
        id1 = Number(user?.id);
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
        // setShowT(false);
        return () => {
            // socket?.off('rooms');
            // setCreated(false);
        }
        
        
    },[created]);
    
    
    useEffect(() => {
        console.log("use effect called in display room");
        let id : number;
        id = Number(user?.id);
        socket?.emit('DisplayRoom', { id },  (response : Room[]) => {
            console.log('rooms in display room :')
            console.log(response);
            setRooms(response);
            // setIsOwner(true);
            // setDisplayDms(false);
            // setDisplayRoom(true);
            // DisplayRooms(response);
        });
        
            socket?.on('rooms', (room) => {
            console.log("from front rooms: ", room);
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
        id = Number(user?.id);
        socket?.emit('Friends', { id },  (response : any) => {
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
        id = Number(user?.id);
        socket?.emit('createMessage', {
            name: selectedRoom ? selectedRoom.name : name,
            text: messageText,
            id: id,
            username: null,
        });
    }

    useEffect(() => {
        console.log("listening on update in front");
        socket?.on('update', (response : any) => {
            console.log("room in update : ");
            console.log(response);
            console.log(Rooms);
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.map((room) => {
                    console.log("in room ", response);
                    if (room.id_chat === response.id) {
                        console.log("user " + user?.id + " will update the room " + room.id_chat + " with room " + response.id);
                        return {
                            ...room,
                            password: response.newPass,
                            type: response.type
                        };
                    }
                    return room;
                });
            });
            // setRooms(...room, {passwrd: room.});
            // setRooms(room);
            
        });

        return () => {
        console.log("off listening on update in front");

            socket?.off('update');
        };
    }, [DisplayRoom]);

    const handleUpdateRoom = (newPass : string, modifypass : boolean, setPass : boolean, removepass : boolean) => {

        socket?.emit('updateRoom', {id: user?.id, name: selectedRoom?.name, type: selectedRoom?.type, newPass: newPass, modifypass: modifypass, setPass: setPass, removepass: removepass }, (response: any) => {
            console.log("response got in update room: ");
            // console.log(response);
            
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.map((room) => {
                    if (room.id_chat === response.id) {
                        return {
                            ...room,
                            password: response.newPass,
                            type: response.type
                        };
                    }
                    return room;
                });
            });


            setSelectedRoom((prevRoom: Room | null) => {
                if (prevRoom === null) {
                    return null;
                    }
                    return {
                        ...prevRoom,
                        password: response.newPass,
                        type: response.type
                        };
            });
        });
        return () => {
            // socket?.off('update');
        }
    }
    
    const handleAdmin = (username : string) => {
        console.log("handle admin called in front");
        console.log("username : " + username);
        socket?.emit('setAdmin', { id: user?.id, username: username, name: selectedRoom?.name }, (response: any) => {
            console.log("response got in set admin: ");
            console.log(response);
            setChatUsers((prevChatUsers: any | null) => {
                if (prevChatUsers === null) {
                    return null;
                }
                return {
                    ...prevChatUsers,
                    role: response.role
                };
            });
        });
        return () => {
            // socket?.off('update');
        }
    }

    const sendMessageDm = (messageText: string) => {

        let id: number;
        let username : string | undefined;
        // console.log('message dm called ')
        // console.log("name in message dm front: " + name);
        id = Number(user?.id);
        username = user?.username;
        socket?.emit('createMessage', {
                name: name,
                text: messageText,
                id: id,
                username: username,
        }, (response : any[]) => {
        });

    }
    
    const getChatUsers = (name: string) => {
        socket?.emit('getChatUsers', { name, id : user?.id }, (response: userChat) => {
            // console.log("response got in getChatUsers: ", response.userChat);
            // console.log("hahahaa", response.id_chat);
            // console.log(response);
            setChatUsers(response);
            // setShowRoom(false);
            // setShowRoom(true);
        });
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
        console.log('room clickedddd with :');
        console.log(room.id_chat);
        console.log(room.name + " ===== " + room.type + " " );
        console.log("with pass = " + selectedPswd);

        getChatUsers(room.name);
        // setRoomId(room.id_chat);
        // setShowRoom(false);
        // setShowT(true)
        // if (selectedRoom?.type === 'PROTECTED') {
        //     setShowT(false);
        // }
        if (room.chatUser && room.chatUser.role === 'OWNER') {
            console.log("is owner is set to true");
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }

        if (room.type === 'PUBLIC') {
            console.log("room is publicccccc");
            setSelectedRoom(room);
            setJoined(true);
            return;
        }

        if (room.type === 'PROTECTED' && room.chatUser) {
            console.log("the Room prtected and chat user is true");
            setSelectedRoom(room);
            setJoined(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd ===  room.password) {
            console.log("room protected and it's modified");
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && !selectedPswd && !room.chatUser) {
            console.log("welcome msg is set to truuuue");
            // console.log("show passjoin is : " + passjoin);
            setPassjoin(true);
            console.log(room);
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd !==  room.password && !room.chatUser) {
            console.log("selected pswd is : " + selectedPswd + " and room pswd is : " + room.password);
            console.log("welcome msg is set to true");
            console.log("show passjoin is : " + passjoin);
            setPassjoin(true);
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PRIVATE') {
            console.log("room is privateeeeee");
            setSelectedRoom(room);
            setJoined(true);
            return;
        }
        // if (room.type === 'PROTECTED' || room.type === 'PRIVATE' || room.type === 'PUBLIC')
        // {
        //     // setPassjoin(!passjoin);
        // }
        // 
        // console.log("then is joined is set to true");
        // if (!joined) 
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        socket?.off('message');
        setSelectedPswd(event.target.value);
        // console.log('selectedPswd in front :' + event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
        // console.log('handle join with password front');
        // setShowRoom(false);
        // setShowT(false);
        // setShowT(true);
        if (selectedPswd === selectedRoom?.password) {
            // setDisplayDms(true);
            // setDisplayDms(false);
            setDisplayRoom(false);
            // setDisplayDms(true);
            // setDisplayDms(false);
            // setDisplayRoom(true);
            // setDisplayDms(false);
            setSelectedPswd("");
            setPassjoin(false);
            setJoined(true);

            // setDisplayRoom(true);
        }
        else
        {
            setShowRoom(false);
            alert("wrong password");
        }
    };
    return (
        <>
        
            <div className="conteneur">
                <div className="gauche">
                    {showRoom && <Leftchat userid={user?.id} showRoom={showRoom}messages={messages} name={selectedRoom?.name} sendMessage={sendMessage} isOwner={isOwner}
                     Roomtype={selectedRoom?.type} handleUpdateRoom={handleUpdateRoom} handleAdmin={handleAdmin} HandleDisplayRoom={HandleDisplayRoom} DisplayRoom={DisplayRoom} room={selectedRoom}
                     getChatUsers={getChatUsers} chatUsers={chatUsers}/> }
                    {ShowDm && <Leftchat userid={user?.id} showDm={ShowDm} messages={messages} name={name}sendMessageDm={sendMessageDm} Friends={Friends}/> }
                    
                {welcomeMsg && 
                    <div className='welcome-message'>Welcome to the chat interface!</div>
                }
                </div>
                <div/>
                <div className="droite">
                    {< Rightchat rooms={Rooms} userId={user?.id} id={user?.id} handleRoomClick={handleRoomClick} create={create}
                     handleRoomPassword={handleRoomPassword} name={name} roomType={roomType} roomPassword={roomPassword}
                     creating={creating} changeName={changeName} setCreating={setCreating} handleRoomType={handleRoomType}
                     handleSelectedPassword={handleSelectedPassword} handleJoinWithPassword={handleJoinWithPassword}
                     selectedPswd={selectedPswd} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} 
                     Friends={Friends} setDisplayDms={setDisplayDms} setDisplayRoom={setDisplayRoom} DisplayDms={DisplayDms} DisplayRoom={DisplayRoom}
                     HandleDisplayDms={HandleDisplayDms} HandleDisplayRoom={HandleDisplayRoom} joindDm={joinDm}
                     messages={messages} lastMessage={lastMessage} isOwner={isOwner} passjoin={passjoin} />}
                </div>            
                </div>
        </>
    );
}