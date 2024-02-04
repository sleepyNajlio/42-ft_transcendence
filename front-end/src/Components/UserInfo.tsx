import '../styles/css/UserInfo.css';
import search from '../assets/SearchIcon.png';
// interface UserInfoProps {
//   profilePicture: string;
//   name: string;
//   onModifyProfileClick: () => void;
// }
// const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name, onModifyProfileClick }) => {
  
  export default function UserInfo(props : any) {
    const handleInputChange = (event: any) => {
      const query = event.target.value;
      props.onSearch(query);
    };
  
    return (
      <div className="search-component">
        <div className="search-bar">
          <img src={search} alt="Icon2" width="20" height="20" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onChange={handleInputChange}
          />
        </div>
      </div>
    );
  }