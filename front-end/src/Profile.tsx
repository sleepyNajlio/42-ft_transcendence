import PofilCard from './Components/PofilCard.tsx';
import MobProfilCard from './Components/MobProfilCard.tsx';
import './styles/css/main.css';
import { useMediaPredicate } from 'react-media-hook';
import { user } from './Components/types.ts';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserProvider.tsx';

export function Profile(props: {  }) {
  const { user } = useContext(UserContext);
  console.log("user: ");
  console.log(user);

  const [tempuser, setTempuser] = useState({
    id: "1",
    username: "Buffalo",
    avatar: "./",
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
  useEffect(() => {
    if (user) {
      setTempuser(prevTempuser => ({
        ...prevTempuser,
        id: user.id_player,
        username: user.username,
        avatar: user.avatar,
      }));
    }
    // console.log("user: ");
    // console.log(user);
    // console.log("tempuser: ");
    // console.log(tempuser);
  }, [user]);
  // use user to fill tempuser
  const checkIfMediumPlus = useMediaPredicate(
    '(min-width: 769px)'
  );
  // const [user1, setUser] = useState<User | null>(null);
  // console.log(user1);
  return (
    <>
      

      <main id='page-wrap' className="wrapper profil">
        <div className="profil container">
        <div className="title">
            <h1 className="ptitle">Profile</h1>
        </div>
        {user && (checkIfMediumPlus ? (
            <PofilCard user={tempuser}></PofilCard>
            ) : (
            <MobProfilCard user={tempuser}></MobProfilCard>
        ))}
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