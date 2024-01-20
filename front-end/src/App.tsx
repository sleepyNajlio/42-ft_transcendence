import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './Components/Navbar.tsx';
import { UserContext } from './UserProvider.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import UnAuthGuard from './guards/UnAuthGuard.tsx';
import { useMediaPredicate, useMedia } from 'react-media-hook';
import {inviteStatus, user} from './Components/types.ts'
import { TestChat } from './Testchat.tsx';
import axios from 'axios';
import { History } from './Components/types.ts';
import { ToastProvider } from 'react-toast-notifications';

interface inviters
{
    user_id: string,
     username: string,
     gameId: number,
}

enum NotifType {
    MESSAGE = 'MESSAGE',
    INVITE = 'INVITE',
    GAME = 'GAME',
  }

function App()
{
    const location = useLocation();
    
    const [invite, setInvite] = useState<inviteStatus>(inviteStatus.NONE);
    const [inviters, setInviters] = useState<{user_id:string, avatar: string, username: string, type: NotifType}[]>([]);
    const [inPlay, setInPlay] = useState(false);
    const [profile, setProfile] = useState<user | null>(null);
    const [history, setHistory] = useState<History[] | null>(null);
    const { user, initialize,  socket } = useContext(UserContext);

    const checkIfMediumPlus = useMediaPredicate(
        '(min-width: 994px)'
        );
        // navbar sizes
        // ```
        // 1200 ==>  20%
        // 994 - 1200 ==> 225px
        // 0 - 994 ==> 0px
        // ```
        
    const [isMediumPlus, isMedium, isSmall] = [useMediaPredicate('(min-width: 1200px)'), useMediaPredicate('(min-width: 994px)'), useMediaPredicate('(min-width: 0px)')]
    
    const inviteResp = async (resp: Boolean, inviter: any) => {
        // if (componentRef)
        // {
            console.log('componentRef: ', width);
            // console.log('componentRef.current: ', componentRef.current);
            // componentRef.current?.scrollIntoView({ behavior: 'smooth' });
        // }
        if (socket && width)
        {
            socket.emit('inviteResp', {
                accepted: resp,
                userId: inviter?.user_id.toString(),
                adv_id: user?.id.toString(),
                avatar: user?.avatar,
                username: user?.username,
                gameId: inviter?.gameId,
                width: width > 750 ? width * 0.8 : width,
            }, async (response: any) => {
                // got players ratio
                console.log('Received acknowledgement from server:', response);
                if (!response) {
                    console.log('error');
                    // setInvite(inviteStatus.ABORTED);
                    // setInviter(null);
                    return;
                }
                setInvite(inviteStatus.ACCEPTED);
                let gameId = await axios.get(`http://localhost:3000/game/${inviter.user_id}/getgame/SEARCHING`, { withCredentials: true });
                console.log('gameId: ', gameId);
                gameId = gameId.data.id_game;
                console.log('gameId: ', gameId);
                await axios.post(`http://localhost:3000/game/${gameId}/joinGame`, {userId: user?.id},  { withCredentials: true });
                await axios.post(`http://localhost:3000/game/${gameId}/updateGame`, {status: 'PLAYING'},  { withCredentials: true });
            });
        }
    };
    
    const isMounted = useRef(true); // useRef to track whether the component is mounted
    const width = useMemo(() => {
        if (!isMounted.current) {
            console.log('isMediumPlus: ', isMediumPlus, ' isMedium: ', isMedium, ' isSmall: ', isSmall);
            if (isMediumPlus){
                console.log('kbira document.body.clientWidth: ', document.body.offsetWidth);
                return document.body.offsetWidth * 0.8;
            }
            else if (isMedium)
                return document.body.offsetWidth - 225;
            else if (isSmall)
            {
                console.log('sghir document.body.clientWidth: ', document.body.offsetWidth);
                return document.body.offsetWidth;
            }
            else
                return 0;
        }
    } , [isMediumPlus, isMedium, isSmall] );
    useEffect(() => {
        if (isMounted.current) {
        initialize();
        console.log('isMounted: ', isMounted.current);
        // socket.emit('playOpen', { id: socket.id });
        }
        return () => {
        isMounted.current = false;
        };
    } , []);
    useEffect(() => {
        // Listen for 'invited' event
        if (socket)
        {
            console.log('listening socket: invited');
            socket.emit('getNotifs', {userId: user?.id.toString()}, (response: any) => {
                console.log('Received acknowledgement from server:', response);
                if (response.length > 0) {
                    // use user_id and username from response to setInviters
                    setInviters(response);
                    setInvite(inviteStatus.NONE);
                    console.log('response: ', response);
                }
            });
            socket.on('invited', (data: any) => handleInvited(data));
            socket.on('rminvite', (data: any) => handleRmInvite(data));
        }
        else
            console.log('no socket');
        // Clean up the event listener on unmount
        return () => {
            socket?.off('invited', handleInvited);
            socket?.off('rminvite', handleRmInvite);
        };
    }, [socket]);
    const handleInvited = (data: any) => {
        if (inPlay)
            return;
        console.log("invited by ", data);
        setInviters(prevInviters => [...prevInviters, {user_id: data.user_id, avatar: data.avatar, username: data.username, type: NotifType.GAME, paddle: data.paddle}]);
        setInvite(inviteStatus.INVITED);
    };
    const handleRmInvite = (data: any) => {
        setInviters(prevInviters => prevInviters.filter((inviter) => inviter.user_id !== data));
        console.log("invite removed ", data);
    };
    const componentRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setboardWidth] = useState<number | null>(null);

    return (
        
        <div className={`container ` + (checkIfMediumPlus ? "default" : "one")}>
        
        <Routes>
            <Route key='Login' path='/' element={<UnAuthGuard component={<Login />}  />}>
                {' '}
            </Route>
            {/* <Route key='Login' path='*' element={<UnAuthGuard component={<Navigate to='/' />}  />}>
                {' '}
            </Route> */}
            <Route
            key='AuthRoutes'
            path='/*'
            element={
                <AuthGuard
                    component={
                    <ToastProvider>
                    <>
                        {location.pathname != "/" && location.pathname != "/Config" && location.pathname != "/TwoFA" && location.pathname != "/Verify2FA" && 
                        (<Navbar setProfile={setProfile} setHistory={setHistory} invite={invite} inviters={inviters} inviteResp={inviteResp} setInvite={setInvite}/>)
                        }
                        {
                            <>
                                <Routes>
                                <Route key='Config' path='/Config' caseSensitive={true} element={<Config />} />
                                <Route key='TwoFA' path='/TwoFA' caseSensitive={true} element={<TwoFA />} />
                                <Route key='testchat' path='/Testchat' caseSensitive={true} element={<TestChat />} />
                                <Route key='Verify2FA' path='/Verify2FA' caseSensitive={true} element={<Verify2FA />} />
                                <Route key='Profile' path='/Profile' caseSensitive={true} element={<Profile freind={profile} fhistory={history} />} />
                                <Route key='Play' path='/Play' caseSensitive={true} element={<Play setHistory={setHistory} setProfile={setProfile} setInPlay={setInPlay} inviter={inviters} setboardWidth={setboardWidth} />} />
                                <Route key='Chat' path='/Chat' caseSensitive={true} element={<Chat />} />
                                <Route key='Settings' path='/Settings' caseSensitive={true} element={<Settings />} />
                                <Route key='Leaderboard' path='/Leaderboard' caseSensitive={true} element={<Leaderboard />} />
                                <Route path='*' element={<Navigate to='/Profile' />} />
                                </Routes>
                            </>
                        }
                        
                    </>
                    </ToastProvider>
                    }
                />
            }
            />
      </Routes>
    </div>
    );
}

export default App;