import React, { useEffect, useRef, useState } from 'react';
import './Notif.css';
import GamePattern from './Pattern.tsx';
import { useNavigate } from 'react-router-dom';
import { setOriginalNode } from 'typescript';


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
    inviteStatus :(resp : any) => void;
    Notifs: Boolean;
    NotifContainer : string;
    setNotifContainer : (resp : string) => void;
    // adders : adders[];
}

const Notification: React.FC<NotificationProps> = ({inviters, inviteResp, inviteStatus, Notifs, NotifContainer, setNotifContainer}) => {
    // setNotifContainer('notif-container');
    const psvgRef = useRef<HTMLDivElement>(null); // Declare psvgRef using useRef hook
    const notification = document.querySelector('.notification');
// When notification appears
// if (notification){
// notification.classList.add('appear');

// // When notification disappears
// notification.classList.remove('appear');
// notification.classList.add('disappear');
// }
// let flag = true;

useEffect(() => {
    console.log("inviters: ", inviters);
} , [inviters]);

    const navigate = useNavigate();
    // const [notifcontainer, setNotifContainer] = useState(notif ? "notif-container" : "notifmacontainer");
    console.log('notifffffffffffff:', NotifContainer);
    // setNotifContainer('notif-container');
    return (
        <div className={NotifContainer} >
            {inviters.map((inviter:inviters, index : number) => (                
                <div className="notification" key={index}>
                    <img src={inviter.avatar} alt="Profile" className="notification-image" />
                    <span className="notification-name">{inviter.username}</span>
                    {
                        inviter.type === "GAME" ? (
                            <GamePattern pad={inviter.paddle} board={0} width={100} height={50} cx={50} cy={25} />
                            ) : inviter.type === "INVITE" ? (
                            <span className="notification-text">Sent you a request</span>
                            ) : inviter.type === "BLOCKED" ? (
                                <span className="notification-text">Blocked you</span>
                                ) : inviter.type === "ACCEPTED" && (
                                    <span className="notification-text">Accepted your request</span>
                                    )
                    }
                    {
                        (inviter.type === "GAME" || inviter.type === "INVITE") &&
                        (
                            <div>
                        <button className="notification-button" onClick={()=> {inviteResp(true, inviter); navigate('/Play')}} >Accept</button>
                        <button className="notification-button" onClick={()=> {inviteResp(false, inviter)}}>Decline</button>
                        </div>
                    ) 
                    }
                </div>
            ))}
        </div>
    );
};

export default Notification;
