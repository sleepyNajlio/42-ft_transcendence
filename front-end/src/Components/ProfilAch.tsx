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
import ach11 from '../assets/ach11.png';
import ach22 from '../assets/ach22.png';
import ach33 from '../assets/ach33.png';
import ach44 from '../assets/ach44.png';
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
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${total_matches >= 1 ? ach1 : ach11})`}}>
        <div className="overlay"><span className="description">BATAL: You played a game!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${total_matches >= 3 ? ach2 : ach22})`}}>
        <div className="overlay"><span className="description">BEAUGOSS : You played three game!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${wins >= 3  ? ach3 : ach33})`}}>
        <div className="overlay"><span className="description">SHARK : You winned three games!</span></div>
      </div>
      <div className="achivements__cercle cell" style={{ backgroundImage: `url(${total_matches >= 5 && wins >= 5 ? ach4 : ach44})`}}>
        <div className="overlay"><span className="description">DIEU : You winned your first 5 games!</span></div>
      </div>
      </div>
    </div>
  );
}
export default ProfilAch;
