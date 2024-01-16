import React from 'react';
import './Notif.css';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Navigate , useNavigate} from 'react-router-dom';
import { inviteStatus } from './types.ts';

interface inviters
{
    user_id: string,
     username: string,
     gameId: number,
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
    console.log("hhhhhahaha", inviters);
    const navigate = useNavigate();
    return (
        <div className="notif-container">
            {inviters.map((inviter:inviters, index : number) => (                
                    <div className="notification" key={index}>
                    <img src={'iii'} alt="Profile" className="notification-image" />
                    <span className="notification-name">{inviter.username}</span>
                    <button className="notification-button" onClick={()=> {inviteResp(true, inviter); navigate('/Play')}} >Accept</button>
                    <button className="notification-button" onClick={()=> inviteResp(false, inviter)}>Decline</button>
                </div>
            ))}
        </div>
    );
};

export default Notification;
