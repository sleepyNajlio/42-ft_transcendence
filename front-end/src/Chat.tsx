import  './styles/css/chat.css'
import { useState, useEffect, useContext} from 'react';
import { useToasts } from 'react-toast-notifications';
import { UserContext } from './UserProvider.tsx';
import Leftchat from './Components/Leftchat.tsx';
import Rightchat from './Components/Rightchat.tsx';
import './styles/css/UserInfo.css';
import './styles/css/inboxBox.css';
import './styles/css/Simpleco.css';
import './styles/css/Switchgrpdm.css';
import './styles/css/ChatHeaderComponent.css';
import './styles/css/chatui.css';
import { Use } from '@svgdotjs/svg.js';
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

export function Chat(props : any) { // get values from data base
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

    const { addToast } = useToasts();


    // const handlejoinpass = () => {
    //   setPassjoin(!passjoin);
    // }
    // const [shouldShowTriangle, setShouldShowTriangle] = useState(false);


    // save the states in local storage
    useEffect(() => { 
        if (!joined || !selectedRoom) return;

        console.log("use effect called in join with rooms : ");
        // console.log(Rooms);
        let id : number;
        id = Number(user?.id);
        socket?.emit('join', { 
            id, 
            name: selectedRoom?.name,
            type: selectedRoom?.type,
            selectedPswd: selectedRoom?.password,
          }, (response: any[]) => {
            if (response) {
              socket?.emit('findAllMessages', { name: selectedRoom?.name, id: user?.id }, (response: any[]) => {
                setMessages(response);
              });
            } else {
              setShowRoom(false);
            }
          });
          
        let isUserBanned: boolean;
        let isUserMuted: boolean;
        socket?.on('message', (message) => {
            // console.log("message in frontttttttt : ");
            // console.log(message);
            if (message.chat.id_chat === selectedRoom?.id_chat) {
                // console.log("usrersss : ");
                // console.log(message.chat.users);
                isUserBanned = message.chat.users.some((usertmp : any) => usertmp.userId === user?.id && usertmp.isBanned);
                isUserMuted = message.chat.users.some((usertmp : any) => usertmp.userId === user?.id && usertmp.isMuted);
                // console.log("is user banned : " + isUserBanned);
                if (!isUserBanned)
                    setMessages((prevMessages) => [...prevMessages, message]);
            }
            setRooms((prevRooms) => {
                if (prevRooms === null) {
                    return null;
                }
                const updatedRooms = prevRooms.map((room) => {
                    if (room.id_chat === message.chatId && !isUserBanned) {
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
        socket?.emit('findAllMessagesDm', {name: name, id, username: username}, (response: any[]) => {
            // console.log("response got in find all: ");
            // console.log(response);
            setMessages(response);
            // console.log(messages);
        });
        socket?.on('message', (message) => {
            // console.log("id chat of the message is: ");
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
        setCreated(false);
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
            // console.log('rooms in display room :')
            // console.log(response);
            setRooms(response);
            // setIsOwner(true);
            // setDisplayDms(false);
            // setDisplayRoom(true);
            // DisplayRooms(response);
        });
        
            socket?.on('rooms', (room) => {
            // console.log("from front rooms: ", room);
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

  

    useEffect( () => {
        // console.log("user" + user?.id + " is listening on update in front");
        // console.log("listening on update in front");
        socket?.on('update', (response : any) => {
                let id : number = Number(user?.id);
                console.log("user " + user?.id + " will add the room " + response.name + " with room " + response.id);
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
            // console.log("user" + user?.id + " is listening on Admin in front");
 
            //      console.log("response got in Admin: ");
            //      console.log(response);
            //      console.log("user id : " + user?.id);
                    // console.log("response user id : " + response.userId);
                 if (response.userId === user?.id)
                 {
                     console.log("user " + user?.id + " listen to him being admin " + response.chatId);
                     setRooms((prevRooms: Room[] | null) => {
                         if (prevRooms === null) {
                             return null;
                         }
                         return prevRooms.map((room) => {
                            //  console.log("in room ", response);
                            //  console.log("room id chat : " + room.id_chat);
                            //     console.log("response chat id : " + response.chatId);
                             if (room.id_chat === response.chatId) {
                                //  console.log("++++++ user " + user?.id + " listen to him being admin " + room.id_chat + " with room " + response.chatId);
                                 
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
                //  console.log("off listening on Admin in front");
                 socket?.off('Admin');
                }
    });

    useEffect(() => {
        socket?.on('onleave', (response) => {
            // console.log("user" + user?.id + " is listening on leave in front");
            // console.log("response got in leave: ");
            // console.log(response);
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
                console.log("User " + user?.id + "entered to change chatUserss in leave");

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
            // console.log("off listening on leave in front");
            socket?.off('leave');
        }
    });

    
    const handleleave = () => {
        // console.log("handle leave called in front");

        socket?.emit('leave', { id: user?.id, name: selectedRoom?.name }, (response: any) => {
            // console.log("response got in leave: ");
            // console.log(response);
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
    console.log("use effect called in show notifff");
    if (showNotifKick)
    addToast(`You were kicked from the room ${KickNotification}`, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 10000,
        });
        setShownotifKick(false);

    }, [showNotifKick]);

    useEffect(() => {
      
        socket?.on('onkick', (response) => {
            if (user?.id === response.userId) {
                console.log("user " + user?.id + " sees him kicked from the room " + response.chat.name);
                console.log("selected room that the user is in ", selectedRoom);
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
                console.log("user is not in the room " + user?.id + " but sees him kicked from the room " + response.chat.name);
                setRooms((prevRooms: Room[] | null) => {
                    if (prevRooms === null) {
                        return null;
                    }
                    return prevRooms.map((room) => {
                        if (response.chat.name === room.name) {
                            console.log("user " + user?.id + " entered to delete hime self from " + response.chat.name);
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
            // console.log("off listening on kick in front");
            socket?.off('onkick');
  
          };
        });

        useEffect(() => {
            console.log("use effect called in show notifff");
            if (showNotifBan)
            addToast(`You were banned from the room ${BanNotification}`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 10000,
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
                   //  console.log("in room ", response);
                   //  console.log("room id chat : " + room.id_chat);
                   //     console.log("response chat id : " + response.chatId);
                    if (room.id_chat === response.chatId && user?.id === response.userId) {
                       //  console.log("++++++ user " + user?.id + " listen to him being admin " + room.id_chat + " with room " + response.chatId);
                        
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
                console.log("response is : ");
                console.log(response);

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
            // console.log("off listening on ban in front");
            socket?.off('onban');
        };
    });

    useEffect(() => {
        console.log("use effect called in show  mute notifff");
        if (showNotifMute)
        addToast(`You were muted for 5 min from the room ${MuteNotification}`, {
            appearance: 'error',
            autoDismiss: true,
            autoDismissTimeout: 10000,
            });
            setShownotifMute(false);
    
        }, [showNotifMute]);

    useEffect(() => {
            console.log("use effect called in mute is over");
            if (MuteisOver)
            addToast(`Your mute for 5 min in room ${MuteNotification} is over`, {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 10000,
                });
                setMuteisOver(false);
        
            }, [MuteisOver]);
    
    useEffect(() => {
        console.log("use effect called in userAdded");
        if (userAdded)
        addToast(`Your were Added in room ${RoomAdded}`, {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 10000,
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
                   //  console.log("in room ", response);
                   //  console.log("room id chat : " + room.id_chat);
                   //     console.log("response chat id : " + response.chatId);
                    if (room.id_chat === response.chatId && user?.id === response.userId) {
                       //  console.log("++++++ user " + user?.id + " listen to him being admin " + room.id_chat + " with room " + response.chatId);
                        
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

                console.log("response is : ");
                console.log(response);

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
                    }, 5 * 6 * 1000));
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
            // console.log("off listening on mute in front");
            socket?.off('onmute');
        }

    });

    useEffect(() => {

        socket?.on('onadd', (response) => {
            if (user?.id === response.userId)
            {
                let id : number = Number(user?.id);
                console.log("user " + response.user.username + " will add the room " + response.chat.name);
                socket?.emit('DisplayRoom', {id},  (response : Room[]) => {
                    setRooms(response);
                });
                setUserAdded(true);
                setRoomAdded(response.chat.name);
                if (timeoutId)
                {
                    console.log("timeout id is not null ", timeoutId);
                    clearTimeout(timeoutId);
                }
                else
                {
                    console.log("timeout id is null");
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
        // console.log("handle kick called in front");
        socket?.emit('kick', { id: userId,  name: name}, (response: any) => {
           if (!response)
                alert("user already not in the room");
        });
    }

    const handleBan = (name : string, userId : number) => {
        // console.log("handle ban called in front");
        socket?.emit('ban', { id: userId,  name: name}, (response: any) => {
            if (!response)
                alert("user already banned or not in the room");
        });
    }

    const handleUpdateRoom = (newPass : string, modifypass : boolean, setPass : boolean, removepass : boolean) => {

        socket?.emit('updateRoom', {id: user?.id, name: selectedRoom?.name, type: selectedRoom?.type, newPass: newPass, modifypass: modifypass, setPass: setPass, removepass: removepass }, (response: any) => {
            // console.log("response got in update room: ");
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
        }
    }
    const handleAdmin = (username : string) => {
        // console.log("handle admin called in front");
        // console.log("username : " + username);
        socket?.emit('setAdmin', { id: user?.id, username: username, name: selectedRoom?.name }, (response: any) => {
            // console.log("response got in set admin: ");
            // console.log(response);
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
            // console.log("response got in add user: ");
            // console.log(response);
            if (!response)
                alert("user already in the room");
        });
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
    
    const getChatUsers = (name: string | null) => {
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
        // console.log('room clickedddd with :');
        // console.log(room.id_chat);
        // console.log(room.name + " ===== " + room.type + " " );
        // console.log("with pass = " + selectedPswd);

        getChatUsers(room.name);
        if (room.chatUser && room.chatUser.role === 'OWNER') {
            // console.log("is owner is set to true");
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        if (room.chatUser && room.chatUser.role === 'ADMIN') {
            // console.log("is admin is set to true");
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        if (room.type === 'PUBLIC') {
            // console.log("room is publicccccc");
            setSelectedRoom(room);
            setJoined(true);
            return;
        }

        if (room.type === 'PROTECTED' && room.chatUser) {
            // console.log("the Room prtected and chat user is true");
            setSelectedRoom(room);
            setJoined(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd ===  room.password) {
            // console.log("room protected and it's modified");
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && !selectedPswd && !room.chatUser) {
            // console.log("welcome msg is set to truuuue");
            // console.log("show passjoin is : " + passjoin);
            setPassjoin(true);
            // console.log(room);
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PROTECTED' && selectedPswd !==  room.password && !room.chatUser) {
            // console.log("selected pswd is : " + selectedPswd + " and room pswd is : " + room.password);
            // console.log("welcome msg is set to true");
            // console.log("show passjoin is : " + passjoin);
            setPassjoin(true);
            setSelectedRoom(room);
            setShowRoom(false);
            setwelcomeMsg(true);
            return;
        }
        if (room.type === 'PRIVATE') {
            // console.log("room is privateeeeee");
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
                     getChatUsers={getChatUsers} isAdmin={isAdmin} chatUsers={chatUsers} handleleave={handleleave} handleKick={handleKick}
                     handleBan={handleBan} handleMute={handleMute} Friends={Friends} handleAddUser={handleAddUser}/> }
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
                     messages={messages} isOwner={isOwner} passjoin={passjoin} />}
                </div>            
                </div>
        </>
    );
}