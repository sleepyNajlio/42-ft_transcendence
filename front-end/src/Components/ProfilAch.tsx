import '../styles/css/Login.css';
import lock from '../assets/lock_line.svg';
import { achievement } from './types.ts';
import ach1 from '../assets/ach1.png';
import ach2 from '../assets/ach2.jpg';
import ach3 from '../assets/ach3.png';
import ach4 from '../assets/ach3.png';
import ach5 from '../assets/ach3.png';
import ach6 from '../assets/ach3.png';
import Achd from '/bsk.png';

const imageList = [
  { name: "First win", src: ach1 },
  { name: "Win 10 games", src: ach2 },
  { name: "Win 100 games", src: ach3 },
  { name: "Win 1000 games", src: ach4 },
  { name: "Win 10000 games", src: ach5 },
  { name: "Win 100000 games", src: ach6 },
];

type ModifiedAchievement = achievement & { src: string };

export function ProfilAch(props: { achievement: achievement[] }) {
  const modifiedAchievements = props.achievement.map((achievement) => {
    const index = imageList.findIndex((image) => image.name.includes(achievement.name));
    if (index !== -1) {
      return {
        ...achievement,
        src: imageList[index].src,
      };
    }
    return achievement as ModifiedAchievement;
  });

  return (
    <div className="left-content achivements">
      <h1 className="ach__title">Achievement</h1>
      <div className="achivements_cells">
        {modifiedAchievements.map((achievement, index) => (
          <div key={index} className="cell">
            <div className="achivements__cercle" style={{ backgroundImage: `url(${achievement.src || Achd} )`, filter: `blur(${achievement.progress === achievement.max ? "0px" : "5px"})` }}>
            </div>
            {(achievement.progress !== achievement.max) && (
                <img
                  src={lock}
                  alt={achievement.name}
                  className="achivement__img"
                />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
