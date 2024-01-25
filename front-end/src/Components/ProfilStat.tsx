import '../styles/css/Login.css';
import { user_stats, cercle } from './types.ts';

export function ProfilStat(props : { user_stats: user_stats, cercle: cercle, stats_names: string[], dasharray: number }){
    return (
    <>
    <div className="profil__stats">
      <div className='profil__ratio'>
        <h3>{(props.user_stats.winsRat * 100).toFixed(0) }%</h3>
        <h6>Ratio</h6>
        <svg>
          <circle id="progress" cx={props.cercle.x} cy={props.cercle.y} r={props.cercle.r} style={{strokeDashoffset : (1 - props.user_stats.winsRat) * props.dasharray}}></circle>
        </svg>
      </div>
      <div className="profil__stats__info">
        <div className="profil__stats__info__cell">
          <h6>{props.stats_names[0]}</h6>
          <h3>{props.user_stats.total_matches}</h3>
        </div>
        <div className="profil__stats__info__cell">
          <h6>{props.stats_names[1]}</h6>
          <h3>{props.user_stats.wins}</h3>
        </div>
        <div className="profil__stats__info__cell">
          <h6>{props.stats_names[2]}</h6>
          <h3>{props.user_stats.achievement}</h3>
        </div>
      </div>
    </div>
    </>
    )
}