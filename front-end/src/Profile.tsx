import Navbar from './Components/Navbar.tsx';
import PofilCard from './Components/PofilCard.tsx';
import MobProfilCard from './Components/MobProfilCard.tsx';
import './styles/css/main.css';
import { useMediaPredicate } from 'react-media-hook';
import { user } from './Components/types.ts';

export function Profile() {
    
  const checkIfMediumPlus = useMediaPredicate(
    '(min-width: 769px)'
  );

  const user = {
    id: "1",
    name: "Buffalo",
    image: "/bsk.png",
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
  } as user;
  

  return (
    <>
      
      <Navbar ></Navbar>

      <main id='page-wrap' className="wrapper profil">
        <div className="profil container">
        <div className="title">
            <h1 className="ptitle">Profile</h1>
        </div>
        {checkIfMediumPlus ? (
            <PofilCard user={user}></PofilCard>
            ) : (
            <MobProfilCard user={user}></MobProfilCard>
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
                </div><div className="rankbar">
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
                </div><div className="rankbar">
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
                </div><div className="rankbar">
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
                </div><div className="rankbar">
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
                </div><div className="rankbar">
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
                </div><div className="rankbar">
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
