import { Routes, Route, useLocation } from 'react-router-dom';
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
import { Test } from './test.tsx'




function App()
{
    const location = useLocation();

    // Define a function to determine the class name based on the current route
    const getClassName = () => {
        const pathname = location.pathname;

        // Map routes to corresponding class names
        const routeClassNames: { [key: string]: string } = {
        '/': 'one',
        '/config': 'one',
        '/twofa': 'one',
        '/verify2fa': 'one',
        };
          
        // Get the class name based on the route, or use a default class name
        return routeClassNames[pathname] || 'default';
    };

    // Get the class name based on the current route
    const className = getClassName();

    return <div className={`container ${className}`}>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Config" element={<Config />} />
            <Route path="/TwoFA" element={<TwoFA />} />
            <Route path="/Verify2FA" element={<Verify2FA />} />
            <Route path="/Play" element={<Play />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Leaderboard" element={<Leaderboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    </div>
}

export default App;