import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App()
{
    return <div className="container">
	<BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Config" element={<Config />} />
                <Route path="/TwoFA" element={<TwoFA />} />
                <Route path="/Verify2FA" element={<Verify2FA />} />
                <Route path="/Play" element={<Play />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/Profil" element={<Profile />} />
            </Routes>
	</BrowserRouter>
    </div>
}

export default App;