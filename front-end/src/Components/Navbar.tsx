import Logo from './Logo';
import '../styles/css/Play.css';
import search from '../assets/search_bar.svg';
import msg_icon from '../assets/message_icon.svg';
import profile_icon from '../assets/profile_icon.svg';
import ranking_icon from '../assets/chart_icon.svg';
import play_icon from '../assets/playground_icon.svg';
import settings from '../assets/settings_icon.svg';
import exit from '../assets/exit.svg';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserProvider.tsx';
import axios from 'axios';
import Notification from './Notif';
import { inviteStatus } from './types.ts';
import UserInfo from './UserInfo.tsx';
import { get } from 'svg.js';

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
    const [searchQuery, setSearchQuery] = useState('');
    const { user, getUserById, getMatchHistory } = useContext(UserContext);
    const [search, setSearch] = useState(false);
    const [users, setUsers] = useState([]);
    // const [Players, setPlayers] = useState(false);
    const navigate = useNavigate();


    const getPlayers = async () => {
        try {
          const response = await fetch('http://localhost:3000/profile/notblocked', {
            credentials: "include",
            method: "GET",
          });
          const data = await response.json(); // Parse the response as JSON
          console.log("data: ", data);
          setUsers(data.users); // Set the parsed data to state
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        if (users.length > 0) {
          console.log("users1: ", users);
          console.log("showing users");
        //   setPlayers(true);
        }
      }, [users]);

  const handleSearch = (query : any) => {
    setSearchQuery(query);
  };

    const handleOnBlur = () => {
        setTimeout(() => {
        }, 200);
    };

  const handleFocus = () => {
    if (users.length === 0)
        getPlayers();

    };

    useEffect(() => {
        if (searchQuery.length === 0) {
            getPlayers();
            setSearch(false);
            return;
        }
        setUsers(
            users.filter((user : any) => {
                return user.username.toLowerCase().includes(searchQuery.toLowerCase());
            } )
        );
        setSearch(true);

    }, [searchQuery]);

    useEffect(() => {
        getPlayers();
    }, [props.profile]);

    function searchPlayer(id_player: string): void {
        setSearch(!search);
        console.log("id_player: ", id_player);
        getMatchHistory(Number(id_player)).then (res => {
          console.log("history: ", res);
          props.setHistory(res);
        } );
        getUserById(Number(id_player)).then (res => {
          console.log("player: ", res);
          props.setProfile(res);
        });
        navigate("/Profile")
      }
    

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
        <Notification setProfile={props.setProfile} inviters={props.inviters} inviteResp={props.inviteResp} inviteStatus={props.inviteStatus}  />
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
        <UserInfo onBlur={handleOnBlur} onFocus={handleFocus} onSearch={handleSearch} />
        <div className="players">
            {
                search && users.map((player : any) => (
                    <div className="user_rec" onClick={() => searchPlayer(player.id_player)} >
                        <div className="image" style={{ backgroundImage: `url(${player.avatar})` }}></div>
                        <span className="text">{player.username}</span>

                    </div>
                ))
            }
        </div>
        <div className="btn_container">
            <Link to="/Play"><button onClick={() =>{props.setHistory(null); props.setProfile(null)}} className="btn">Play</button></Link>

            
            <div className="icon">
                <img src={play_icon} alt="Play Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Profile"><button onClick={() =>{props.setHistory(null); props.setProfile(null)}} className="btn">Profile</button></Link>

            <div className="icon">
                <img src={profile_icon} alt="Profile Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Chat"><button onClick={() =>{props.setHistory(null); props.setProfile(null)}} className="btn">Messages</button></Link>

            <div className="icon">
                <img src={msg_icon} alt="Messages Icon"/>
            </div>
        </div>
        <div className="btn_container">
            <Link to="/Leaderboard"><button onClick={() =>{props.setHistory(null); props.setProfile(null)}} className="btn">Ranking</button></Link>

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
            <Link to="/Settings"><button onClick={() =>{props.setHistory(null); props.setProfile(null)}} className="btn">Settings</button></Link>
            <div className="icon">
                <img src={settings} alt="Settings Icon"/>
            </div>
        </div>
            <div className="logout">
                <div className="user">
                    <div className="cercle_profile" style={{ backgroundImage: `url(${user && user.avatar})` }}></div>
                    <span className="name">{user && user.username}</span>
                </div>
                <div style={{ flexDirection: 'row-reverse', display: 'flex' }}>
                    <a href="http://localhost:3000/user/logout">
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <img width="40" height="40" src={exit} alt="Search Icon"/>
                    </div>
                    </a>
                </div>
            </div>
    </section>
    </>
  )
}