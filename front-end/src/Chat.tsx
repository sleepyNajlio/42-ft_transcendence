import  './styles/css/chat.css'
import React, { useState, useEffect, useContext} from 'react';
import { UserContext } from './UserProvider.tsx';
import Leftchat from './Components/Leftchat.tsx';
import Rightchat from './Components/Rightchat.tsx';
import './styles/css/UserInfo.css';
import './styles/css/inboxBox.css';
import './styles/css/Simpleco.css';
import './styles/css/Switchgrpdm.css';
import './styles/css/ChatHeaderComponent.css';
import './styles/css/chatui.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { off } from '@svgdotjs/svg.js';
// import { user } from './Components/types.ts';

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


export default function Chat (props: any)  {
    const [joined, setJoined] = useState(false);
    const { user, socket } = useContext(UserContext);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
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
    const [lastMessage, setLastMessage] = useState("");
    const [welcomeMsg, setwelcomeMsg] = useState(!(showRoom || ShowDm || DisplayDms || DisplayRoom));
    const [passjoin, setPassjoin] = useState(true);
    const [chatUsers, setChatUsers] = useState<userChat | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNotifKick, setShownotifKick] = useState(false);
    const [showNotifBan, setShownotifBan] = useState(false);
    const [BanNotification, setBanNotification] = useState("");
    const [KickNotification, setKickNotification] = useState("");
    const [showNotifMute, setShownotifMute] = useState(false);
    const [MuteNotification, setMuteNotification] = useState("");
    const [MuteisOver, setMuteisOver] = useState(false);
    const [userAdded, setUserAdded] = useState(false);
    const [RoomAdded, setRoomAdded] = useState("");
    const [timeoutId, setTimeoutid] = useState<NodeJS.Timeout | null > (null);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    // save the states in local storage
    useEffect(() => { 
        if (!joined || !selectedRoom) return;
        setMessages([]);
        let id : number;
        id = Number(user?.id);
        socket?.emit('join', { 
            id, 
            name: selectedRoom?.name,
            type: selectedRoom?.type,
            selectedPswd: selectedPswd,
          }, (response: any) => {
            if (response) {
                socket?.emit('findAllMessages', { name: selectedRoom?.name, id: user?.id }, (response: any[]) => {
                    setMessages(response);
                });
              let isUserBanned: boolean;
              let friendshipStatus : any;
              let friendshipStatus1 : any;
              let isBlocked : boolean ;
              setShowRoom(true);
              if (ShowDm) setShowDm(false);
              setwelcomeMsg(false);
              setDisplayRoom(true);
              setJoined(false);
                setRooms((prevRooms) => {
                if (prevRooms === null) {
                    return null;
                }
                const updatedRooms = prevRooms.map((room) => {
                    if (room.id_chat === response.id_chat) {
                        return {
                            ...room,
                            chatUser: {
                                ...room.chatUser,
                            },
                        };
                    }
                    return room;
                });
                return updatedRooms;
            });

              socket?.on('message', (message) => {
                  if (message.chat.id_chat === selectedRoom?.id_chat) {
                          
                    if (message.user.friendshipAsked.length > 0)
                    {
                        friendshipStatus = message.user.friendshipAsked.find((friendship: any) => (friendship.userId === user?.id && friendship.friendId === message.userId) || (friendship.friendId === user?.id && friendship.userId === message.userId));
                    }
                    else
                        friendshipStatus = null;
                    if (message.user.friendshipReceived.length > 0)
                    {
                        friendshipStatus1 = message.user.friendshipReceived.find((friendship: any) => (friendship.userId === user?.id && friendship.friendId === message.userId) || (friendship.friendId === user?.id && friendship.userId === message.userId));
                    }
                    else
                        friendshipStatus1 = null;
          
                      isUserBanned = message.chat.users.some((usertmp : any) => usertmp.userId === user?.id && usertmp.isBanned);
                      isBlocked = (friendshipStatus?.status === 'BLOCKED' || friendshipStatus1?.status === 'BLOCKED')
                      if (!isUserBanned && !isBlocked)
                          setMessages((prevMessages) => [...prevMessages, message]);
                  }
                  setRooms((prevRooms) => {
                      if (prevRooms === null) {
                          return null;
                      }
                      const updatedRooms = prevRooms.map((room) => {
                          if (room.id_chat === message.chatId && !isUserBanned && !isBlocked) {
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
      
                  // selectedPswd && setSelectedPswd("");
            } else {
                setShowRoom(false);
                alert('Wrong password');
              setwelcomeMsg(true);
              setJoined(false);
            }
          });

            return () => {
            // socket?.off('message');
            // setJoined(false);
        }
    }, [joined, selectedRoom]);
    

    useEffect(() => {
        if (!joinfriend) return;
        let id : number;
        let username : string | undefined;
        id = Number(user?.id);
        username = user?.username;
        socket?.emit('joinDm', { id ,  name: name, username:username},  (response : any[]) => {
            
        });
        socket?.emit('findAllMessagesDm', {name: name, id, username: username}, (response: any[]) => {
            setMessages(response);
        });
        socket?.on('message', (message) => {
            if ((message.user.username === username || message.user.username === name) && message.chat.name ===  null && message.chat.type === 'PRIVATE')
            {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
            if (message.chat.name === null && message.chat.type === 'PRIVATE')
            {
                setFriends((prevFriends) => {
                    const updatedFriends = prevFriends.map((friend) => {
                        if (friend.username === message.user.username || (message.user.username === user?.username && friend.username === name) ) {
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
            }
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
        socket?.off('message');
        setName(username);
        // setShowDm(false);
        setJoinfriend(true);
        // setShowT(false);
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
        setDisplayRoom(true);
        setCreated(false);
        setName("");
        // setShowT(false);
        return () => {
            // socket?.off('rooms');
            // setCreated(false);
        }
        
        
    },[created]);
    
    
    useEffect(() => {
        let id : number;
        id = Number(user?.id);
        socket?.emit('DisplayRoom', { id },  (response : Room[]) => {
            setRooms(response);

        });
            socket?.on('rooms', (room) => {
            if (room.chatUser.userId != user?.id)
            {
                room.chatUser.role = "MEMBER";
                room.chatUser.userId = user?.id;
            }
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                        return [room];
                    }
                    return [...prevRooms, room];
                });
                
            });
    return () => {
        socket?.off('rooms');
    };
    }, [user, DisplayRoom]);

    useEffect(() => {
        if (!DisplayDms) return;
        let id : number;
        id = Number(user?.id);
        socket?.emit('Friends', { id },  (response : any) => {
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
        // socket?.off('rooms');
        setDisplayDms(false);
        setDisplayRoom(true);
    }

  

    useEffect( () => {
        socket?.on('update', (response : any) => {
                let id : number = Number(user?.id);
                socket?.emit('DisplayRoom', {id},  (response : Room[]) => {
                    setRooms(response);
                }); 
                if (user?.id != response.userId)
                {
                    if (selectedRoom && selectedRoom.id_chat === response.id)
                    {
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
                    }
                }
        });

        return () => {

            socket?.off('update');
            // socket?.off('rooms');
        };
    });

    useEffect(() => {

        socket?.on('Admin', (response) => {
 
                 if (response.userId === user?.id)
                 {
                     setRooms((prevRooms: Room[] | null) => {
                         if (prevRooms === null) {
                             return null;
                         }
                         return prevRooms.map((room) => {
                             if (room.id_chat === response.chatId) {
                                 
                                    return {
                                        ...room,
                                        chatUser: {
                                            ...room.chatUser,
                                            role: response.role,
                                        },
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
                                chatUser: {
                                    ...prevRoom.chatUser,
                                    role: response.role,
                                },
                                
                        };
                    });
                }
             
             });
             
             return () => {
                 socket?.off('Admin');
                }
    });

    useEffect(() => {
        socket?.on('onleave', (response) => {
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.filter((room) => {
                    if (room.id_chat !== response.id) {
                        return room;
                    }
                    return null;
                });
            });

            if (selectedRoom?.name === response.chat.name && response.role === 'OWNER') {

                setChatUsers((prevChatUsers: any | null) => {
                    if (prevChatUsers === null) {
                        return null;
                    }
                    const updatedChatUsers = { ...prevChatUsers };
                    delete updatedChatUsers[response.userId];
                    return updatedChatUsers;
                });
            }
        });
        return () => {
            socket?.off('leave');
        }
    });

    
    const handleleave = () => {

        socket?.emit('leave', { id: user?.id, name: selectedRoom?.name }, (response: any) => {
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.filter((room) => {
                    if (room.id_chat !== response.id) {
                        return room;
                    }
                    return null;
                });
            });
            setSelectedRoom(null); 
        });
        if (DisplayDms) setDisplayDms(!DisplayDms);
        if (DisplayRoom) setDisplayRoom(!DisplayRoom);
        if (ShowDm) setShowDm(!ShowDm);
        if (showRoom) setShowRoom(!showRoom);
        setwelcomeMsg(true);
    }

    useEffect(() => {
    if (showNotifKick)
    toast.error(`You were kicked from the room ${KickNotification}`, {
        autoClose: 10000
    });
        setShownotifKick(false);

    }, [showNotifKick]);

    useEffect(() => {
      
        socket?.on('onkick', (response) => {
            if (user?.id === response.userId) {
                if (selectedRoom?.name === response.chat.name) {
                  setSelectedRoom(null);
                  if (DisplayDms)
                      setDisplayDms(!DisplayDms);
                  if (DisplayRoom)
                      setDisplayRoom(!DisplayRoom);
                  if (ShowDm)
                      setShowDm(!ShowDm);
                  if (showRoom)
                      setShowRoom(!showRoom);
                  setwelcomeMsg(true);
                  setKickNotification(response.chat.name);
                  setShownotifKick(true);
              }
              else
              {
                setRooms((prevRooms: Room[] | null) => {
                    if (prevRooms === null) {
                        return null;
                    }
                    return prevRooms.map((room) => {
                        if (response.chat.name === room.name) {
                            delete room.chatUser;
                            return room;
                        }
                        return room;
                    });
                });
                setKickNotification(response.chat.name);
                setShownotifKick(true);
              }
          }
          });
          return () => {
            socket?.off('onkick');
  
          };
        });

        useEffect(() => {
            if (showNotifBan)
            toast.error(`You were banned from the room ${BanNotification}`, {
                autoClose: 10000
            });
            setShownotifBan(false);
        
            }, [showNotifBan]);


        useEffect(() => {
        socket?.on('onban', (response) => {

            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.map((room) => {
                    if (room.id_chat === response.chatId && user?.id === response.userId) {
                        
                           return {
                               ...room,
                               chatUser: {
                                   ...room.chatUser,
                                   role: response.role,
                                   isBanned: response.isBanned
                               },
                           };
                    }
                    return room;
                });
            });
            if (user?.id === response.userId)
            {

                setChatUsers((prevChatUsers: any | null) => {
                    if (prevChatUsers === null) {
                        return null;
                    }
                    if (prevChatUsers[response.userId])
                    {
                        const updatedChatUsers = { ...prevChatUsers };
                        updatedChatUsers[response.userId].isBanned = true;
                        return updatedChatUsers;
                    }
                });

                setBanNotification(response.chat.name);
                setShownotifBan(true);
                
                if (selectedRoom?.name === response.chat.name) {
                    setSelectedRoom((prevRoom: Room | null) => {
                        if (prevRoom === null) {
                            return null;
                            }
                            return {
                                ...prevRoom,
                                chatUser: {
                                    ...prevRoom.chatUser,
                                    role: response.role,
                                    isBanned: response.isBanned
                                },
                                
                        };
                    });
                }
            }
        });

        return () => {
            socket?.off('onban');
        };
    });

    useEffect(() => {
        if (showNotifMute)
        toast.error(`You were muted for 5 min from the room ${MuteNotification}`, {
            autoClose: 10000
        });
            setShownotifMute(false);
    
        }, [showNotifMute]);

    useEffect(() => {
            if (MuteisOver)
            toast.success(`Your mute for 5 min in room ${MuteNotification} is over`, {
                autoClose: 10000
            });
                setMuteisOver(false);
        
            }, [MuteisOver]);
    
    useEffect(() => {
        if (userAdded)
        toast.success(`Your were Added in room ${RoomAdded}`, {
            autoClose: 10000
        });
            setUserAdded(false);
    
    }, [userAdded]);

    useEffect(() => {

        socket?.on('onmute', (response) => {
            setRooms((prevRooms: Room[] | null) => {
                if (prevRooms === null) {
                    return null;
                }
                return prevRooms.map((room) => {
                    if (room.id_chat === response.chatId && user?.id === response.userId) {
                        
                           return {
                               ...room,
                               chatUser: {
                                    ...room.chatUser,
                                    role: response.role,
                                    isMuted: response.isMuted
                               },
                           };
                    }
                    return room;
                });
            });
            if (user?.id === response.userId) {


                setChatUsers((prevChatUsers: any | null) => {
                    if (prevChatUsers === null) {
                        return null;
                    }
                    if (prevChatUsers && prevChatUsers[response.userId])
                    {
                        const updatedChatUsers = { ...prevChatUsers };
                        updatedChatUsers[response.userId].isMuted = response.isMuted;
                        return updatedChatUsers;
                    }
                });
                if (response.isMuted){
                    setMuteNotification(response.chat.name);
                    setShownotifMute(true);
                    setTimeoutid(setTimeout(() => {
                            setMuteisOver(true);
                            setMuteNotification(response.chat.name);
                    }, 5 * 60 * 1000));
                }
                if (selectedRoom?.name === response.chat.name) {
                    setSelectedRoom((prevRoom: Room | null) => {
                        if (prevRoom === null) {
                            return null;
                            }
                            return {
                                ...prevRoom,
                                chatUser: {
                                    ...prevRoom.chatUser,
                                    role: response.role,
                                    isMuted: response.isMuted,
                                },
                                
                        };
                    });
                }
            }
        });


        return () => {
            socket?.off('onmute');
        }

    });

    // useEffect(() => {

    //     socket?.on('blocked', (response : any) => {
    //         let id = Number(user?.id);
    //         socket?.emit('Friends', { id },  (friends : any) => {

    //             if (name && name === response.username)
    //             {
    //                 setFriends(friends.filter((friend : any) => friend.username !== response.username));
    //                 // setDisplayDms(!DisplayDms);
    //                 setShowDm(!ShowDm);
    //                 setwelcomeMsg(true);
    //             }
    //             else
    //             {
    //                 setFriends(friends.filter((friend : any) => friend.username !== response.username));
    //             }

    //         });
    //     });
    //     return () => {
    //         socket?.off('blocked');
    //     }
    // });

    useEffect(() => {

        socket?.on('onadd', (response) => {
            if (user?.id === response.userId)
            {
                let id : number = Number(user?.id);
                socket?.emit('DisplayRoom', {id},  (response : Room[]) => {
                    setRooms(response);
                });
                setUserAdded(true);
                setRoomAdded(response.chat.name);
                if (timeoutId)
                {
                    clearTimeout(timeoutId);
                }
                else
                {
                }
            }
        });
        return () => {
            socket?.off('onadd');
        }
    });


      
    const handleMute = (name : string, userId : number) => {

        socket?.emit('mute', { id: userId,  name: name}, (response: any) => {
            if (!response)
                alert("user already muted or not in the room");
        });
    }

    const handleKick = (name : string, userId : number) => {
        socket?.emit('kick', { id: userId,  name: name}, (response: any) => {
           if (!response)
                alert("user already not in the room");
        });
    }

    const handleBan = (name : string, userId : number) => {
        socket?.emit('ban', { id: userId,  name: name}, (response: any) => {
            if (!response)
                alert("user already banned or not in the room");
        });
    }

    const getFriends = () => {
        socket?.emit('Friends', { id: user?.id },  (response : any) => {
            setFriends(response);
        });
    }

    const handleUpdateRoom = (newPass : string, modifypass : boolean, setPass : boolean, removepass : boolean) => {

        socket?.emit('updateRoom', {id: user?.id, name: selectedRoom?.name, type: selectedRoom?.type, newPass: newPass, modifypass: modifypass, setPass: setPass, removepass: removepass }, (response: any) => {
            
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
        }
    }
    const handleAdmin = (username : string) => {
        socket?.emit('setAdmin', { id: user?.id, username: username, name: selectedRoom?.name }, (response: any) => {
            setChatUsers((prevChatUsers: any | null) => {
                if (prevChatUsers === null) {
                    return null;
                }
                return { ...prevChatUsers, role: response.role }; 
            });

            // setDisplayRoom(!DisplayRoom);
            // setDisplayRoom(!DisplayRoom);
        });
        return () => {
        }
    }

    const handleAddUser = (username : string) => {
        socket?.emit('addUser', { id: user?.id, username: username, name: selectedRoom?.name }, (response: any) => {
            if (!response)
                alert("user already in the room");
        });
    }





    const sendMessage = (messageText: string) => {
        let id: number;
        id = Number(user?.id);
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
    
    const getChatUsers = (name: string | null) => {
        socket?.emit('getChatUsers', { name, id : user?.id }, (response: userChat) => {
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
        if (showRoom || ShowDm)
        {
            setShowDm(false);
            setShowRoom(false);
            setwelcomeMsg(true);
            setMessages([]);
        }
        setCreated(!created);
        setCreating(false);
    };

    const handleRoomType = (type: string) => {
        setRoomType(type);
    };

    const handleRoomPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPassword(event.target.value);
    };

    useEffect(() => {
        if (props.inviters.length === 0) return;
        const lastnotif = props.inviters[props.inviters.length - 1];
        socket?.emit('Friends', { id: user?.id },  (response : any) => {
            if (lastnotif?.type === 'BLOCKED')
            {
                if (name && name === lastnotif.username)
                {
                    setFriends(response.filter((friend : any) => friend.username !== response.username));
                    // setDisplayDms(!DisplayDms);
                    setShowDm(!ShowDm);
                    setwelcomeMsg(true);
                }
                else
                {
                    setFriends(response.filter((friend : any) => friend.username !== response.username));
                }
            }
            else
            {
                setFriends(response);
            }
        });
        return () => {
            // socket?.off('accepted');
        }
    }, [props.inviters, props.invite])


    // for joining room
    const handleRoomClick = (room: Room) => {
        socket?.off('message');
        getChatUsers(room.name);
        if (room.chatUser && room.chatUser.role === 'OWNER') {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        if (room.chatUser && room.chatUser.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        if (room.type === 'PUBLIC') {
            setSelectedRoom(room);
            setJoined(true);
            return;
        }

        if (room.type === 'PROTECTED' && room.chatUser) {
            setSelectedRoom(room);
            setJoined(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd ===  room.password) {
            setSelectedRoom(room);
            setShowRoom(false);
            setShowDm(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && !selectedPswd && !room.chatUser) {
            setPassjoin(true);
            setSelectedRoom(room);
            setShowDm(false);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd !==  room.password && !room.chatUser) {
            setPassjoin(true);
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PRIVATE') {
            setSelectedRoom(room);
            setJoined(true);
            return;
        }
        // if (room.type === 'PROTECTED' || room.type === 'PRIVATE' || room.type === 'PUBLIC')
        // {
        //     // setPassjoin(!passjoin);
        // }
        // 
        // if (!joined) 
      };
    const handleSelectedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        socket?.off('message');
        setSelectedPswd(event.target.value);
        // join();
    }

    const handleJoinWithPassword = () => {
        setPassjoin(false);
        setJoined(true);
    };
    return (
        <>
            <div className="conteneur">
                <div className="gauche">
                    {showRoom && <Leftchat userid={user?.id} showRoom={showRoom}messages={messages} name={selectedRoom?.name} sendMessage={sendMessage} isOwner={isOwner}
                     Roomtype={selectedRoom?.type} handleUpdateRoom={handleUpdateRoom} handleAdmin={handleAdmin} HandleDisplayRoom={HandleDisplayRoom} DisplayRoom={DisplayRoom} room={selectedRoom}
                     getChatUsers={getChatUsers} isAdmin={isAdmin} chatUsers={chatUsers} handleleave={handleleave} handleKick={handleKick}
                     handleBan={handleBan} handleMute={handleMute} Friends={Friends} handleAddUser={handleAddUser} getFriends={getFriends}/> }
                    {ShowDm && <Leftchat userid={user?.id} showDm={ShowDm} messages={messages} name={name} sendMessageDm={sendMessageDm} Friends={Friends} setProfile={props.setProfile} setHistory={props.setHistory}
                    inviteTogame={props.inviteTogame} setInviter={props.setInviter}/> }
                    
                {welcomeMsg && 
                    <div className="welcome-message-container">
                    <div className="welcome-message">
                        Welcome to the chat interface!
                    </div>
                    <> Join/Create channels </> <br/>
                    <> send private messages </>
                    </div>
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
                     messages={messages} isOwner={isOwner} passjoin={passjoin} toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>}
                </div>            
                </div>
                <ToastContainer/>
        </>
    );
}