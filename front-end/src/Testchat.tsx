// App.tsx
import Navbar from './Components/Navbar.tsx';
import Leftchat from './Components/Leftchat.tsx';
import Rightchat from './Components/Rightchat.tsx';


// import UserInfo from './Components/UserInfo.tsx';
// import InboxBox from './Components/InboxBox.tsx';
// import Switchgrpdm from './Components/Switchgrpdm.tsx';
// import Messageco from './Components/Messageco.tsx';
// import pic from './assets/messi.jpg'
// import ChatHeaderComponent from './Components/ChatHeaderComponent.tsx';
import './styles/css/ChatHeaderComponent.css';
import { useState, useEffect } from 'react';

// import Sendmessage from './Components/Sendmessage.tsx'


interface Room {
  id: number;
  name: string;
  type: string;
  password: string;
}

export function TestChat() {

  const [Rooms, setRooms] = useState<any[]>([]);
  const [Friends, setFriends] = useState<any[]>([]);



  return (
    <>
        {/* <Navbar></Navbar> */}
        <div className="conteneur">
      <div className="gauche">
        <Leftchat />
      </div>
      <div className="droite">
        <Rightchat />
      </div>
    </div>

    </>
  )
}