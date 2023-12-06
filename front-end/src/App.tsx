import { Routes, Route } from 'react-router-dom';
import { Login } from "./Login.tsx";
import { Config } from "./Config.tsx";
import './styles/css/App.css';
import { TwoFA } from './TwoFA.tsx';
import { Verify2FA } from './Verify2FA.tsx';
import { Play } from './Play.tsx';
import { Chat } from './Chat.tsx';
import { Settings } from './Settings.tsx'
import { Leaderboard } from './Leaderboard.tsx'
import { Profile } from './Profile.tsx'
import { useEffect, useState } from 'react';
import { initializeSocket } from "./socket";
import { initializeUser, getUser } from "./player";
  
function App()
{
    // catching response from nest server
    // const [data, setData] = useState('');

    //     useEffect(() => {
    //     fetch('http://localhost:3000')
    //     .then((response) => response.text())
        
    //   .then((data) => setData(data))
    //   .catch((error) => console.error('Error fetching data:', error));
    //     }, []);
    
    // building the app
    const getClassName = () => {
    const pathname = location.pathname;
    const routeClassNames: { [key: string]: string } = {
    '/': 'one',
    '/Config': 'one',
    '/twofa': 'one',
    '/verify2fa': 'one',
        };
          
        // Get the class name based on the route, or use a default class name
        return routeClassNames[pathname] || 'default';
    };

    // Get the class name based on the current route
    const className = getClassName();

    const [profileLoaded, setProfileLoaded] = useState(false);
    const [isauthenticated, setisauthenticated] = useState(false);
    useEffect(() => {
        let profileInit = false;
        if (isauthenticated && !profileInit) {
            console.log("initializing user and socket");
            const initialize = async () => {
                await initializeUser();
                getUser().then(user => {
                    initializeSocket(user.id_player);
                    setProfileLoaded(true);
                }).catch(error => {
                    console.error("Failed to get user: ", error);
                });
            }
            initialize();
            profileInit = true;
        }
    }, [isauthenticated]);

    return (
        <div className={`container ${className}`}>
        <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/Config" element={isauthenticated ? <Config /> : <Navigate to="/" />} /> */}
            <Route path="/Config" element={<Config />} />
            <Route path="/TwoFA" element={<TwoFA />} />
            <Route path="/Verify2FA" element={<Verify2FA />} />
            <Route path="/Play" element={<Play />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Leaderboard" element={<Leaderboard />} />
            <Route path="/Profile" element={<Profile onLoaded={() => setisauthenticated(true)} profileLoaded={profileLoaded} />} />
        </Routes>
    </div>
    );
}

export default App;