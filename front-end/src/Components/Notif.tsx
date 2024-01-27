import React, { useEffect, useRef, useState } from 'react';
import './Notif.css';
import GamePattern from './Pattern.tsx';
import { useNavigate } from 'react-router-dom';
import { inviteStatus, user } from './types.ts';
import { rejectFriend, addFriend, blockFriend, acceptFriend } from '../player';


interface inviters
{
    user_id: string,
     username: string,
     avatar: string,
     type: string,
     paddle: number,
}
// interface adders
// {
//     name: string;
//     imageUrl: string;
// }
interface NotificationProps {
    inviters : inviters[];
    inviteResp : (resp: Boolean, inviter: any) => void;
    setProfile : React.Dispatch<React.SetStateAction<user | null>>
    Notifs: Boolean;
    NotifContainer : string;
    setNotifContainer : (resp : string) => void;
    setInvite : React.Dispatch<React.SetStateAction<inviteStatus>>;
    // adders : adders[];
}

const Notification: React.FC<NotificationProps> = ({setInvite, inviters, inviteResp, Notifs, NotifContainer, setNotifContainer, setProfile}) => {
    // setNotifContainer('notif-container');
    const psvgRef = useRef<HTMLDivElement>(null); // Declare psvgRef using useRef hook
    useEffect(() => {
        console.log("inviters: ", inviters);
    } , [inviters]);
    const navigate = useNavigate();
    
    const HandleAccept = async (id: number) => {
        setProfile((prevProfile: user | null) => {
            if (!prevProfile) {
                return prevProfile;
            }
            return {
                ...prevProfile,
                friend: {
                    ...prevProfile.friend,
                    status: "ACCEPTED",
                    userId: prevProfile.friend?.userId || 0, // Set a default value of 0 if userId is undefined
                    friendId: prevProfile.friend?.friendId || 0, // Set a default value of 0 if userId is undefined
                },
            };
        });
        await acceptFriend(id);
        setInvite(inviteStatus.ACCEPTED);
    }

    const HandleReject = async (id: number) => {
        setProfile((prevProfile: user | null) => {
            if (!prevProfile) {
                return prevProfile;
            }
            return {
                ...prevProfile,
                friend: {
                    ...prevProfile.friend,
                    status: "REJECTED",
                    userId: prevProfile.friend?.userId || 0, // Set a default value of 0 if userId is undefined
                    friendId: prevProfile.friend?.friendId || 0, // Set a default value of 0 if userId is undefined
                },
            };
        });
        rejectFriend(id)
    }


    return (
        <div className={NotifContainer} >
            {inviters.map((inviter:inviters, index : number) => (                
                <div className="notification" key={index}>
                    <img src={inviter.avatar} alt="Profile" className="notification-image" />
                    <span className="notification-name">{inviter.username}</span>
                    {
                        inviter.type === "GAME" ? (
                            <>
                            <GamePattern pad={inviter.paddle} board={0} width={100} height={50} cx={50} cy={25} />
                            <button className="notification-button" onClick={()=> {inviteResp(true, inviter); navigate('/Play')}} >Accept</button>
                            <button className="notification-button" onClick={()=> {inviteResp(false, inviter)}}>Decline</button>
                            </>
                        ) : inviter.type === "INVITE" ? (
                            <>
                            <span className="notification-text">Sent you a request</span>
                            <button className="notification-button" onClick={()=> HandleAccept(Number(inviter.user_id)) } >Accept</button>
                            <button className="notification-button" onClick={()=> HandleReject(Number(inviter.user_id)) }>Decline</button>
                            </>
                        ) : inviter.type === "BLOCKED" ? (
                            <span className="notification-text">Blocked you</span>
                        ) : inviter.type === "ACCEPTED" ? (
                            <span className="notification-text">Accepted your request</span>
                        ) : inviter.type === "REJECTED" && (
                            <span className="notification-text">Rejected your request</span>
                        )
                    }
                </div>
            ))}
        </div>
    );
};

export default Notification;
