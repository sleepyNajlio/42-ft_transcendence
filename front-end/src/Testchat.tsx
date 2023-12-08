// App.tsx
import Navbar from './Components/Navbar.tsx';
// import UserInfo from './Components/UserInfo.tsx';
// import InboxBox from './Components/InboxBox.tsx';
import Switchgrpdm from './Components/Switchgrpdm.tsx';



import './styles/css/chat.css';

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
      <Switchgrpdm/>
    </div>
    </>
  )
}