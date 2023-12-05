import Logo from './Logo';
import '../styles/css/Play.css';
import search from '../assets/search_bar.svg';
import msg_icon from '../assets/message_icon.svg';
import profile_icon from '../assets/profile_icon.svg';
import ranking_icon from '../assets/chart_icon.svg';
import play_icon from '../assets/playground_icon.svg';
import settings from '../assets/settings_icon.svg';
import { User } from './types.ts';
import exit from '../assets/exit.svg';
import { useEffect, useState } from 'react';

export default function Navbar() {
    async function getUserInfo() {
        const response = await fetch("http://localhost:3000/profile", {
          credentials: "include",
          method: "GET",
        });
        if (response.ok) {
          console.log(response);
          const res = await response.json();
          return res.user;
        } else {
          // alert("Failed to fetch user data");
          console.log("Failed to fetch user data");
          // console.log(response.message);
        }
      }
    
      const [user, setUser] = useState({} as User);
    
      useEffect(() => {
        const fetchData = async () => {
          const user: User = await getUserInfo();
          setUser(user);
        };
        fetchData();
      }, []);
    
  return (
    <>
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
            <button className="btn">Play</button>
            <div className="icon">
                <img src={play_icon} alt="Search Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <button className="btn">Profile</button>
            <div className="icon">
                <img src={profile_icon} alt="Search Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <button className="btn">Messages</button>
            <div className="icon">
                <img src={msg_icon} alt="Search Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <button className="btn">Ranking</button>
            <div className="icon">
                <img src={ranking_icon} alt="Search Icon"/>
            </div>
        </div>
        <div className="line">
        </div>
        <div className="btn_container">
            <button className="btn">Settings</button>
            <div className="icon">
                <img src={settings} alt="Search Icon"/>
            </div>
        </div>
        <div className="logout">
            <div className="user">
                <div className="cercle_profile" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                <span className="name">{user.username}</span>
            </div>
            <div>
                <img width="40" height="40" src={exit} alt="Search Icon"/>
            </div>
        </div>
    </section>
    </>
  )
}