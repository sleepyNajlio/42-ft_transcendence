// App.tsx
import Navbar from './Components/Navbar.tsx';
// import UserInfo from './Components/UserInfo.tsx';
// import InboxBox from './Components/InboxBox.tsx';
// import Switchgrpdm from './Components/Switchgrpdm.tsx';
import Messageco from './Components/Messageco.tsx';
import pic from './assets/messi.jpg'
// import ChatHeaderComponent from './Components/ChatHeaderComponent.tsx';
import './styles/css/ChatHeaderComponent.css';
// import Sendmessage from './Components/Sendmessage.tsx'





// import './styles/css/chat.css';
// import './styles/css/Simpleco.css';

// const App: React.FC = () => {
//   const handleModifyProfileClick = () => {
//     // Add logic to handle the "Modify Profile" button click
//     console.log('Modify Profile clicked!');
//   };
export function Testchat() {
  return (
    <>
        <Navbar></Navbar>
      <div>
      Your own message
      <Messageco
        text="This is your message."
        profileImageUrl={pic}
        isOwnMessage={true}
      />

      Friend's message
      <Messageco
        text="This is your friend's message."
        profileImageUrl={pic}
        isOwnMessage={false}
      />
    </div>
        {/* <div> */}
      {/* Other components and messages */}
      {/* <Sendmessage onSendMessage={Sendmessage} /> */}
    {/* </div> */}

    </>
  )
}