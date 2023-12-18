import '../styles/css/UserInfo.css';
// import messi from '../assets/messi.jpg';
// interface UserInfoProps {
//   profilePicture: string;
//   name: string;
//   onModifyProfileClick: () => void;
// }

// const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name, onModifyProfileClick }) => {
export default function UserInfo() {
    return (
<div className="search-component">
      <div className="search-bar">
        <img
          src="search-icon.png" // Replace with the path to your search icon image
          alt="Search Icon"
          width="20"
          height="20"
        />
        <input
          type="text"
          placeholder="Search..."
        />
      </div>
    </div>
    )
}