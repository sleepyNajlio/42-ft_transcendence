import { Routes, Route, Navigate, Link } from 'react-router-dom';
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
import { useEffect, useMemo, useState } from 'react';
import { initializeSocket } from "./socket";
import { initializeUser, getUser } from "./player";
import axios from 'axios';
import AuthRoutes from './routes/AuthRoutes.tsx';
import UnAuthRoutes from './routes/UnAuthRoutes.tsx';
import Navbar from './Components/Navbar.tsx';
import { UserProvider } from './UserProvider.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import UnAuthGuard from './guards/UnAuthGuard.tsx';
import { useMediaPredicate } from 'react-media-hook';
import { TestChat } from './Testchat.tsx';



function App()
{
    const checkIfMediumPlus = useMediaPredicate(
        '(min-width: 769px)'
      );
    
    return (
        <div className={`container ` + (checkIfMediumPlus ? "default" : "one")}>
        <Routes>
            <Route key='Login' path='/' element={<UnAuthGuard component={<Login />}  />}>
                {' '}
            </Route>
            <Route
            key='AuthRoutes'
            path='/*'
            element={
                <UserProvider>
                <AuthGuard
                    component={
                    <>
                        <Navbar />
                        <Routes>
                        <Route key='Config' path='/Config' caseSensitive={false} element={<Config />} />
                        <Route key='TwoFA' path='/TwoFA' caseSensitive={false} element={<TwoFA />} />
                        <Route key='testchat' path='/Testchat' caseSensitive={false} element={<TestChat />} />
                        <Route key='Verify2FA' path='/Verify2FA' caseSensitive={false} element={<Verify2FA />} />
                        <Route key='Profile' path='/Profile' caseSensitive={false} element={<Profile />} />
                        <Route key='Play' path='/Play' caseSensitive={false} element={<Play />} />
                        <Route key='Chat' path='/Chat' caseSensitive={false} element={<Chat />} />
                        <Route key='Settings' path='/Settings' caseSensitive={false} element={<Settings />} />
                        <Route key='Leaderboard' path='/Leaderboard' caseSensitive={false} element={<Leaderboard />} />
                        <Route path='*' element={<Navigate to='/' />} />
                        </Routes>
                    </>
                    }
                />
                </UserProvider>
            }
            />
      </Routes>
    </div>
    );
}

export default App;