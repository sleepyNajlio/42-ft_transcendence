import '../styles/css/inboxBox.css';
import messi from '../assets/messi.jpg';
// interface UserInfoProps {
//   profilePicture: string;
//   name: string;
//   onModifyProfileClick: () => void;
// }

// const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name, onModifyProfileClick }) => {
export default function InboxBox() {
    return (
        <div className="simple-component">
        <div className="profile-picture">
          <img
            src={messi} // Replace with the path to your profile image
            alt="Profile"
            width="100%"
            height="100%"
          />
        </div>
        <div className="text-container">
          <p className="text1">Lionel Andres Messi</p>
          <p className="text2">you: salam a7san la3ib f l3alam</p>
        </div>
      </div>
    )
}