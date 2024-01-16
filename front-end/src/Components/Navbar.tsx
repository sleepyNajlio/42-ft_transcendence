import Logo from './Logo';
import '../styles/css/Play.css';
import search from '../assets/search_bar.svg';
import msg_icon from '../assets/message_icon.svg';
import profile_icon from '../assets/profile_icon.svg';
import ranking_icon from '../assets/chart_icon.svg';
import play_icon from '../assets/playground_icon.svg';
import settings from '../assets/settings_icon.svg';
import exit from '../assets/exit.svg';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserProvider.tsx';
import axios from 'axios';
import Notification from './Notif';
import { inviteStatus } from './types.ts';

async function logout() {
    axios.get('http://localhost:3001/auth/logout', { withCredentials: true })
    .then((res) => {
        console.log(res);
        window.location.reload();
    })
    .catch((err) => {
        console.log(err);
    })

    }



export default function Navbar(props: any) {
    const { user } = useContext(UserContext);
    function popNotifs() {
        console.log("hhhhh\n");
        if(props.invite === inviteStatus.NONE){
         setNotifs(!Notifs);
        }
         props.setInvite(inviteStatus.NONE);

    }
    const [Notifs, setNotifs] = useState<Boolean>(false);
  return (
    <>
    {
        (props.invite === inviteStatus.INVITED || Notifs) &&
        (
        <Notification inviters={props.inviters} inviteResp={props.inviteResp} inviteStatus={props.inviteStatus}  />
        )

    }
    <input type="checkbox" id="menu-toggle"/>
      <label htmlFor="menu-toggle" className="menu-icon">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </label>
    <section className="Navbar">
      <Logo name={"plogo"}></Logo>
        <div className="search_container">
        <input type="text" placeholder="Search" />
            <div className="search-icon">
                <img src={search} alt="Search Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Play"><button className="btn">Play</button></Link>

            
            <div className="icon">
                <img src={play_icon} alt="Play Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Profile"><button className="btn">Profile</button></Link>

            <div className="icon">
                <img src={profile_icon} alt="Profile Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Chat"><button className="btn">Messages</button></Link>

            <div className="icon">
                <img src={msg_icon} alt="Messages Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Leaderboard"><button className="btn">Ranking</button></Link>

            <div className="icon">
                <img src={ranking_icon} alt="Search Icon"/>
            </div>
        </div>
        <div className="line">
        </div>
        <div className="btn_container">
            <button onClick={popNotifs} className="btn">Notification</button>
            <div className="icon">
                <img src={settings} alt="Notification Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Settings"><button className="btn">Settings</button></Link>
            <div className="icon">
                <img src={settings} alt="Settings Icon"/>
            </div>
        </div>
            <div className="logout">
                <div className="user">
                    <div className="cercle_profile" style={{ backgroundImage: `url(${user && user.avatar})` }}></div>
                    <span className="name">{user && user.username}</span>
                </div>
                <a href="http://localhost:3000/user/logout">
                <div>
                    <img width="40" height="40" src={exit} alt="Search Icon"/>
                </div>
                </a>
            </div>
    </section>
    </>
  )
}