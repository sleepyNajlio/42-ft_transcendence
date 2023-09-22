import Logo from './Logo';
import '../styles/css/Play.css';
import search from '../assets/search_bar.svg';
import msg_icon from '../assets/message_icon.svg';
import profile_icon from '../assets/profile_icon.svg';
import ranking_icon from '../assets/chart_icon.svg';
import play_icon from '../assets/playground_icon.svg';
import settings from '../assets/settings_icon.svg';
import exit from '../assets/exit.svg';

export default function Navbar() {

  return (
    <>
    <section className="Navbar">
      <Logo></Logo>
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
                <div className="cercle"></div>
                <span className="name">Richard</span>
            </div>
            <div>
                <img width="40" height="40" src={exit} alt="Search Icon"/>
            </div>
        </div>
    </section>
    </>
  )
}