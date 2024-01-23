// // AchievementComponent.tsx
import React from 'react';
// import { achievement } from './types';
import '../styles/css/Login.css';
import lock from '../assets/lock_line.svg';
// import { achievement } from './types.ts';
import ach1 from '../assets/ach1.png';
import ach2 from '../assets/ach2.png';
import ach3 from '../assets/ach3.png';
import ach4 from '../assets/ach4.png';
import { NonMorphable } from '@svgdotjs/svg.js';

interface AchievementProps {
  winsRat: number;
  wins: number;
  total_matches: number;
}
      {/* <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div>
      <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div>
      <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div>
      <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div>
      <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div>
      <div className="achivements__cercle" style={{ backgroundImage: `url(${Achd} )`, filter: `blur(${achievement === 6 ? "0px" : "5px"})` }}></div> */}
const ProfilAch: React.FC<AchievementProps> = ({ winsRat, wins, total_matches }) => {
  return (
    <div className="left-content achivements">
      <h1 className="ach__title">Achievement</h1>
      <div className="achivements_cells">
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${ach1} )`, filter: `blur(${total_matches >= 1 ? "0px" : "5px"})`, display: 'flex' }}>
        <div className="overlay"><span className="description">BATAL: You played a game!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${ach2} )`, filter: `blur(${total_matches >= 3 ? "0px" : "5px"})` }}>
        <div className="overlay"><span className="description">BEAUGOSS : You played three game!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${ach3} )`, filter: `blur(${wins >= 3 ? "0px" : "5px"})` }}>
        <div className="overlay"><span className="description">SHARK : You wined three games!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${ach4} )`, filter: `blur(${winsRat === 1 && total_matches >= 5  ? "0px" : "5px"})` }}>
        <div className="overlay"><span className="description">DIEU : You wined your first 5 games!</span></div>
      </div>
      </div>
    </div>
  );
}
export default ProfilAch;
