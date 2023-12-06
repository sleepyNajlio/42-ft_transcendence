import Navbar from './Components/Navbar.tsx';
import PofilCard from './Components/PofilCard.tsx';
import MobProfilCard from './Components/MobProfilCard.tsx';
import './styles/css/main.css';
import { useMediaPredicate } from 'react-media-hook';
import { User, user } from './Components/types.ts';
import { useState, useEffect } from 'react';
import { getUser } from './player';

export function Profile(props: { onLoaded: () => void; profileLoaded: boolean }) {

  const { profileLoaded } = props;
  
  useEffect(() => {
    props.onLoaded();
  }, []);

  const [tempuser, setTempuser] = useState({
    id: "1",
    username: "Buffalo",
    avatar: "/bsk.png",
    rank: 1,
    user_stats: {
      total_matches: 341,
      wins: 203,
      winsRat: 64,
      achievement: 3,
    },
    achievement: [
        {name: "First win", description: "Win your first game", progress: 1, max: 1},
        {name: "Win 10 games", description: "Win 10 games", progress: 10, max: 10},
        {name: "Win 100 games", description: "Win 100 games", progress: 99, max: 100},
        {name: "default", description: "Win 100 games", progress: 0, max: 100},
        {name: "default", description: "Win 100 games", progress: 0, max: 100},
        {name: "default", description: "Win 100 games", progress: 0, max: 100},
    ],
  } as user);

  const [user, setUser] = useState({} as User);

  useEffect(() => {
    if (profileLoaded) {
      getUser().then(user => {
        setUser(user);
        console.log("getting user: ",user);
        setUser(user);
        setTempuser({ ...tempuser, ...user });
      }).catch(error => {
        console.error("Failed to get user: ", error);
      });
    }
  }, [profileLoaded]);
  const checkIfMediumPlus = useMediaPredicate(
    '(min-width: 769px)'
  );
  if (!profileLoaded) {
    return <div>Loading...</div>;
  }
  // const [user1, setUser] = useState<User | null>(null);
  // console.log(user1);
  return (
    <>
      
      <Navbar></Navbar>

      <main id='page-wrap' className="wrapper profil">
        <div className="profil container">
        <div className="title">
            <h1 className="ptitle">Profile</h1>
        </div>
        {checkIfMediumPlus ? (
            <PofilCard user={tempuser}></PofilCard>
            ) : (
            <MobProfilCard user={tempuser}></MobProfilCard>
        )}
        <div className="right-div">
              <h1 className="rank__title">History</h1>
              <div className="history">
                <div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">-</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      </main>
    </>
  );
}
