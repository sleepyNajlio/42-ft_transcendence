import '../styles/css/Login.css';

export function ProfilInfo(props : {name: string, rank: number, image: string}){
    return (
    <>
    <div className="left-content profil__info">
      <img src={props.image} alt="" className="profil__pic" />
      <div className="profil__user">
        <h4 className="profil__username">{props.name}</h4>
        <h6 className="profil__rank">#{props.rank}</h6>
      </div>
    </div>
    </>
    )
};