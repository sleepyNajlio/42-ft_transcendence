import '../styles/css/Login.css';
import ProfilAch  from './ProfilAch';
import { ProfilInfo } from './ProfilInfo';
import { ProfilStat } from './ProfilStat';

import { user, cercle } from './types.ts';




function PofilCard(props: {user: user}){
  let cercle = {
    x: 40,
    y: 40,
    r:  40,
  } as cercle;
  let Mstats_names = ["T M", "W", "Ac"];
  return (
    <>
    <div className="left-div desktop">
      <div className="ptest desktop">
        <div className="left-content profil__card">
          <ProfilStat user_stats={props.user.user_stats} cercle={cercle} stats_names={Mstats_names}></ProfilStat>
        </div>
        <ProfilInfo name={props.user.username} rank={props.user.rank} image={props.user.avatar}></ProfilInfo>
      </div>
    </div>
    <ProfilAch winsRat={props.user.user_stats.winsRat} wins={props.user.user_stats.wins} total_matches={props.user.user_stats.total_matches}></ProfilAch>

    </>
    )
}

export default PofilCard;