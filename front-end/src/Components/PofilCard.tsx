import '../styles/css/Login.css';
import  ProfilAch  from './ProfilAch';
import { ProfilInfo } from './ProfilInfo';
import { ProfilStat } from './ProfilStat';
import { user, cercle} from './types.ts';

function PofilCard(props: {user: user, setFriend: React.Dispatch<React.SetStateAction<user | null>>}){
  let cercle = {
    x: 90,
    y: 90,
    r:  80,
  } as cercle;
  let Dstats_names = ["Total matches", "Wins", "Achievement"];


    return (
    <>
    <div className={`left-div`}>
      <div className={`ptest`}>
        <ProfilInfo setFriend={props.setFriend} id={props.user.id} status={props.user.status} state={props.user.friend} name={props.user.username} rank={props.user.rank} image={props.user.avatar}></ProfilInfo>
        <div className={`left-content profil__card`}>
          <ProfilStat user_stats={props.user.user_stats} cercle={cercle} stats_names={Dstats_names} dasharray={500}></ProfilStat>
        </div>
      </div>
        <ProfilAch winsRat={props.user.user_stats.winsRat} wins={props.user.user_stats.wins} total_matches={props.user.user_stats.total_matches}></ProfilAch>
    </div>
    </>
    )
}

export default PofilCard;
