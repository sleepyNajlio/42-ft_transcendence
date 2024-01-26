import '../styles/css/Login.css';
import ProfilAch  from './ProfilAch';
import { ProfilInfo } from './ProfilInfo';
import { ProfilStat } from './ProfilStat';

import { user, cercle } from './types.ts';




function PofilCard(props: {user: user, setFriend: React.Dispatch<React.SetStateAction<user | null>>}){
  let cercle = {
    x: 44,
    y: 44,
    r:  40,
  } as cercle;
  let Mstats_names = ["T M", "W", "Ac"];
  return (
    <>
    <div className="left-div desktop">
      <div className="ptest desktop">
        <div className="left-content profil__card">
          <ProfilStat  user_stats={props.user.user_stats} cercle={cercle} stats_names={Mstats_names} dasharray={250}></ProfilStat>
        </div>
        <ProfilInfo setFriend={props.setFriend} status={props.user.status} id={props.user.id} state={props.user.friend} name={props.user.username} rank={props.user.rank} image={props.user.avatar}></ProfilInfo>
      </div>
    </div>
    <ProfilAch winsRat={props.user.user_stats.winsRat} wins={props.user.user_stats.wins} total_matches={props.user.user_stats.total_matches}></ProfilAch>

    </>
    )
}

export default PofilCard;