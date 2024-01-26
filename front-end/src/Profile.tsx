import PofilCard from './Components/PofilCard.tsx';
import MobProfilCard from './Components/MobProfilCard.tsx';
import './styles/css/main.css';
import { useMediaPredicate } from 'react-media-hook';
import { user } from './Components/types.ts';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './UserProvider.tsx';
import { History } from './Components/types.ts';


export function Profile(props: {setFriend: React.Dispatch<React.SetStateAction<user | null>> ,freind?: user | null, fhistory: History[] | null }) {
  const { user, history } = useContext(UserContext);
  const [tempuser, setTempuser] = useState({
    id: "1",
    username: "Buffalo",
    avatar: "./",
    rank: 1,
    user_stats: {
      total_matches: 1,
      wins: 1,
      winsRat: 1,
    },
    achievement: 0,
  } as user);
  useEffect(() => {
    if (user && !props.freind) {
      setTempuser(prevTempuser => ({
        ...prevTempuser,
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        user_stats: user.user_stats,
        rank: user.rank,
        achievement: user.achievement,
      }));
      console.log("hstoire: ");
      console.log(history);
    }
    console.log("user updated: ");
    // console.log(user);
    // console.log("tempuser: ");
    // console.log(tempuser);
  }, [user]);
  // use user to fill tempuser
  const checkIfMediumPlus = useMediaPredicate(
    '(min-width: 769px)'
  );
  useEffect(() => {
    console.log("profile mounted");
    return () => {
      console.log("profile unmounted");
    };
  } , []);
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
            <PofilCard setFriend={props.setFriend} user={props.freind || tempuser}></PofilCard>
            ) : (
            <MobProfilCard setFriend={props.setFriend} user={props.freind || tempuser}></MobProfilCard>
        ))}
        <div className="right-div">
              <h1 className="rank__title">History</h1>
              <div className="history">
                    {history && (props.fhistory || history).map((item, index) => (
                      <div className="rankbar" key={index} style={{ boxShadow: item.score1 < item.score2 ? '0 0 5px red' : '0 0 5px green' }}>
                        <div className="rank__user" >
                          <div className="rank__cercle" style={{backgroundImage: `url(${user?.avatar})`}}></div>
                        </div>
                          <div className="score">
                            <span className="rankval">{item.score1}</span>
                            <span className="rankname">-</span>
                            <span className="rankval">{item.score2}</span>
                          </div>
                        <div className="rank__user" key={index}>
                          <div className="rank__cercle" style={{backgroundImage: `url(${item.user2})`}}></div>
                        </div>
                      </div>
                      ))}
            </div>
        </div>
      </div>
      </main>
    </>
  );
}