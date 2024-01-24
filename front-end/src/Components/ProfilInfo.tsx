import { useContext, useEffect, useState } from 'react';
import '../styles/css/Login.css';
import { UserContext } from '../UserProvider';
import axios from 'axios';
import { user } from './types';

export function ProfilInfo(props : {setFriend:React.Dispatch<React.SetStateAction<user | null>>, id: string | undefined ,state: {userId:number, friendId:number, status:string} | undefined, name: string, rank: number, image: string}){
  const {user, socket} = useContext(UserContext);
  const [status, setstatus] = useState(props.state?.status)
  const [newRequest, setNewRequest] = useState(false);

  const addFriend = async () => {
    if(socket)
    {
      socket.emit('addFriend', {id: Number(user?.id), frId: Number(props.id), username: user?.username, avatar: user?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/friend', {
        id: props.id, // replace this with the friend's id
      }, { withCredentials: true });
      console.log(response.data.message);
      setstatus("PENDING")
      setNewRequest(true);
    } catch (error : any) {
      console.error(error.response.data);
    }
  }

  const blockFriend = async () => {
    if(socket)
    {
      socket.emit('block', {id: Number(user?.id), frId: Number(props.id), username: user?.username, avatar: user?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/update/friend', {
        id: props.id, // replace this with the friend's id
        status: "BLOCKED"
      }, { withCredentials: true });
      console.log(response.data.message);
      props.setFriend(null);
      setstatus("BLOCKED")
    } catch (error : any) {
      console.error(error.response.data);
    }
  }

  useEffect(() => {
    setstatus(props.state?.status)
    console.log("state ",props.state, "status ", status, "newRequest ", newRequest);
    return () => {
      setstatus("")
    }
  } , [props.id, props.state?.status]);

  const acceptFriend = async () => {
    if(socket)
    {
      socket.emit('acceptFriend', {id: Number(user?.id), frId: Number(props.id), username: user?.username, avatar: user?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/update/friend', {
        id: props.id,
        status: "ACCEPTED" // replace this with the friend's id
      }, { withCredentials: true });
      setstatus("ACCEPTED")
      console.log(response.data.message);
    } catch (error : any) {
      console.error(error.response.data);
    }
  }

  console.log("state ",props.state, "status ", status);
    return (
    <>
    <div className="left-content profil__info">
      <img src={props.image} alt="" className="profil__pic" />
      <div className="profil__user">
        <h4 className="profil__username">{props.name}</h4>
        <h6 className="profil__rank">#{props.rank}</h6>
        {
          (props.name !== user?.username) && (
            (!status) ? (
              <div className="bt">
                <button className="bt profil__button add" onClick={addFriend}>ADD</button>
                <button className="bt profil__button block" onClick={blockFriend}>Block</button>
              </div>
            ) : (status === "PENDING") ? (
              ((props.state?.friendId === Number(user?.id))) || newRequest ?
              (
                <div className="bt">
                  <span>PENDING</span>
                  <button className="bt profil__button block" onClick={blockFriend}>Block</button>
                </div>
              ):(
                <div className="bt">
                <button className="bt profil__button add" onClick={acceptFriend}>ACCEPT</button>
                  <button className="bt profil__button block" onClick={blockFriend}>Block</button>
                </div>
              )
            ) : (status === "BLOCKED") ? (
              <div className="bt">
                <span>Blocked</span>
              </div>
            ) : (
              <div className="bt">
                <button className="bt profil__button block" onClick={blockFriend}>Block</button>
              </div>
            )
          )
        }
      </div>
    </div>
    </>
    )
};