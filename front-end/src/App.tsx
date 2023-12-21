import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
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
import { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from './Components/Navbar.tsx';
import { UserContext } from './UserProvider.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import UnAuthGuard from './guards/UnAuthGuard.tsx';
import { useMediaPredicate } from 'react-media-hook';
import {inviteStatus} from './Components/types.ts'


function App()
{
    const { user, socket } = useContext(UserContext);
    const checkIfMediumPlus = useMediaPredicate(
        '(min-width: 769px)'
      );

    const navigate = useNavigate();

    const [invite, setInvite] = useState<inviteStatus>(inviteStatus.NONE);
    const [inviters, setInviters] = useState<{id: string, username: string}[]>([]);
    const [isnotified, setisnotified] = useState(true);
    const [inPlay, setInPlay] = useState(false);

    useEffect(() => {
        const handleInvited = (data: any) => {
            console.log("invited by ", data);
            setInviters([...inviters, {id: data.user_id, username: data.username}]);
            setInvite(inviteStatus.INVITED);
            console.log(inviters);
            setTimeout(() => {
                setisnotified(false);
            } , 200000);
        };
        // Listen for 'invited' event
        if (socket)
        {
            console.log('listening socket: invited');
            socket?.on('invited', (data: any) => handleInvited(data));
        }
        else
            console.log('no socket');
        // Clean up the event listener on unmount
        return () => {
            socket?.off('invited', handleInvited);
        };
    }, [socket]);

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
                <AuthGuard
                    component={
                    <>
                        <Navbar />
                        {!inPlay && isnotified && invite === inviteStatus.INVITED && (
                            <div className="invite sbox">
                                {inviters.map((inviter) => (
                                        <div>
                                            <div className="sbox__title">
                                                <h1 className="btitle">{inviter.username}</h1>
                                                <h3 className="stitle">invited you to play</h3>
                                            </div>
                                            <div className="sbox__btn">
                                                <button className="trans bt" onClick={() => {
                                                    setInvite(inviteStatus.ACCEPTED);
                                                    navigate('/Play')
                                                }}>Accept</button>
                                                <button className="filled bt" onClick={() => setInvite(inviteStatus.DECLINED)}>decline</button>
                                            </div>
                                        </div>
                                ))}
                            </div>
                        )  
                        }
                        <Routes>
                        <Route key='Config' path='/Config' caseSensitive={false} element={<Config />} />
                        <Route key='TwoFA' path='/TwoFA' caseSensitive={false} element={<TwoFA />} />
                        <Route key='Verify2FA' path='/Verify2FA' caseSensitive={false} element={<Verify2FA />} />
                        <Route key='Profile' path='/Profile' caseSensitive={false} element={<Profile />} />
                        <Route key='Play' path='/Play' caseSensitive={false} element={<Play setInPlay={setInPlay} setInviter={setInviters} inviter={inviters} setInvite={setInvite} invite={invite} />} />
                        <Route key='Chat' path='/Chat' caseSensitive={false} element={<Chat />} />
                        <Route key='Settings' path='/Settings' caseSensitive={false} element={<Settings />} />
                        <Route key='Leaderboard' path='/Leaderboard' caseSensitive={false} element={<Leaderboard />} />
                        <Route path='*' element={<Navigate to='/' />} />
                        </Routes>
                    </>
                    }
                />
            }
            />
      </Routes>
    </div>
    );
}

export default App;