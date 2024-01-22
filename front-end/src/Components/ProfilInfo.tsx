import { useContext } from 'react';
import '../styles/css/Login.css';
import { UserContext } from '../UserProvider';

export function ProfilInfo(props : {state: string | undefined, name: string, rank: number, image: string}){
  const {user} = useContext(UserContext);
  const dosomth = () => {
    console
  }

  console.log(props.state);
    return (
    <>
    <div className="left-content profil__info">
      <img src={props.image} alt="" className="profil__pic" />
      <div className="profil__user">
        <h4 className="profil__username">{props.name}</h4>
        <h6 className="profil__rank">#{props.rank}</h6>
        {
          props.name !== user?.username && props.state !== "ACCEPTED" && (
            <div className="bt">
              <button className="bt profil__button add" onClick={dosomth}>ADD</button>
              <button className="bt profil__button block">Block</button>
            </div>
          )
        }
      </div>
    </div>
    </>
    )
};