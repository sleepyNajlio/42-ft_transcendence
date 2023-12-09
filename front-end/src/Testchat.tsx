// App.tsx
import Navbar from './Components/Navbar.tsx';
// import UserInfo from './Components/UserInfo.tsx';
// import InboxBox from './Components/InboxBox.tsx';
// import Switchgrpdm from './Components/Switchgrpdm.tsx';
// import Simpleco from './Components/Simpleco.tsx';
import pic from './assets/messi.jpg'
import ChatHeaderComponent from './Components/ChatHeaderComponent.tsx';
import './styles/css/ChatHeaderComponent.css';





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
    <div className="app">
      <ChatHeaderComponent friendName="fahid" profileImageUrl={pic}/>
    </div>
    </>
  )
}