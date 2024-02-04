import { useContext, useEffect, useState } from 'react';
import '../styles/css/Login.css';
import { UserContext } from '../UserProvider';
import { user } from './types';
import { rejectFriend, addFriend, blockFriend, acceptFriend } from '../player';

export function ProfilInfo(props : {status: string, setFriend:React.Dispatch<React.SetStateAction<user | null>>, id: string | undefined ,state: {userId:number, friendId:number, status:string} | undefined, name: string, rank: number, image: string}){
  const {user} = useContext(UserContext);
  const [status, setstatus] = useState(props.state?.status)
  const [newRequest, setNewRequest] = useState(false);

  const rejectFriendb = async (id: number) => {
    rejectFriend(id);
    setstatus("REJECTED");
  }

  const addFriendb = async (id: number) => {
    addFriend(id);
    setstatus("PENDING");
    setNewRequest(true);
  }

  const blockFriendb = async (id: number) => {
    blockFriend(id);
    props.setFriend(null);
    setstatus("BLOCKED");
  }

  useEffect(() => {
    setstatus(props.state?.status)
    setNewRequest(false);
    return () => {
      setstatus("")
    }
  } , [props.id, props.state]);

  const acceptFriendb = async (id: number) => {
    acceptFriend(id)
    setstatus("ACCEPTED")
  }

    return (
    <>
    <div className="left-content profil__info">
      <img src={props.image} alt="" className="profil__pic" />
      <div className="profil__user">
        <h4 className="profil__username">{props.name}</h4>
        <h6 className="profil__rank">#{props.rank}</h6>
        <h2 className="profil__status">{props.status}</h2>
        {
          (props.name !== user?.username) && (
            (!status || status === "REJECTED") ? (
              <div className='btx'>
              <div className="bt">
                <a className="add" onClick={() => addFriendb(Number(props.id))}>ADD</a>
              </div>
                <div className="bt">
                  <a className="block" onClick={() => blockFriendb(Number(props.id))}>Block</a>
                  </div>
              </div>
            ) : (status === "PENDING") ? (
              (((props.state?.friendId === Number(user?.id))) || newRequest) ?
              (
                <div className="btx">
                  <span style={{ marginTop: '17px' }}>PENDING</span>
                <div className="bt">
                  <a className="block" onClick={() => blockFriendb(Number(props.id))}>Block</a>
                </div>
                </div>
              ):(
                <div className='btx'>
                <div className="bt">
                <a className='accept' onClick={() => acceptFriendb(Number(props.id))}>ACCEPT</a>
                </div>
                <div className="bt">
                <a className='reject' onClick={() => rejectFriendb(Number(props.id))}>REJECT</a>
                </div>
                <div className="bt">
                  <a className='block' onClick={() => blockFriendb(Number(props.id))}>Block</a>
                </div>
                </div>
              )
            ) : (status === "BLOCKED") ? (
              <div className="bt">
                <span>Blocked</span>
              </div>
            ) : (
              <div className="bt">
                <a className='block' onClick={() => blockFriendb(Number(props.id))}>Block</a>
              </div>
            )
          )
        }
      </div>
    </div>
    </>
    )
};