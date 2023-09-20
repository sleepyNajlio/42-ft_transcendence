import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./Login.tsx";
import { Config } from "./Config.tsx";
import './styles/css/App.css';
import { TwoFA } from './TwoFA.tsx';
import { Verify2FA } from './Verify2FA.tsx';
import { Play } from './Play.tsx';

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

                
            </Routes>
	</BrowserRouter>
    </div>
}

export default App;