import React, { useEffect, useRef } from 'react';
import './Notif.css';
import GamePattern from './Pattern.tsx';
import { useNavigate } from 'react-router-dom';


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
    // adders : adders[];
}

const Notification: React.FC<NotificationProps> = ({inviters, inviteResp, inviteStatus }) => {
    const psvgRef = useRef<HTMLDivElement>(null); // Declare psvgRef using useRef hook
useEffect(() => {
    console.log("inviters: ", inviters);
} , [inviters]);
    const navigate = useNavigate();
    return (
        <div className="notif-container">
            {inviters.map((inviter:inviters, index : number) => (                
                    <div className="notification" key={index}>
                    <img src={inviter.avatar} alt="Profile" className="notification-image" />
                    <span className="notification-name">{inviter.username}</span>
                    {inviter.type === "GAME" && (
                        <GamePattern pad={inviter.paddle} board={0} width={100} height={50} cx={50} cy={25} />
                        )
                    }
                    {inviter.type !== "GAME" &&
                        (
                            <span className="notification-text">Sent you a request</span>
                        )
                    }
                    <button className="notification-button" onClick={()=> {inviteResp(true, inviter); navigate('/Play')}} >Accept</button>
                    <button className="notification-button" onClick={()=> {inviteResp(false, inviter)}}>Decline</button>
                </div>
            ))}
        </div>
    );
};

export default Notification;
