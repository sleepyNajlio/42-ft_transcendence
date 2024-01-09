import '../styles/css/inboxBox.css';
import messi from '../assets/messi.jpg';
// interface UserInfoProps {
//   profilePicture: string;
//   name: string;
//   onModifyProfileClick: () => void;
// }

// const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name, onModifyProfileClick }) => {
export default function InboxBox(props : any) {
    
    // console.log("props in inboxbox : ")
    // console.log("room in inbox box: " + props.room.users);
    // if (props.room.chatUser)
    //   console.log(props.room.chatUser.userId);
    // console.log('userId issss: ' + props.userId)
    // console.log("props.room.users : " , props.room.users);
    // console.log("props.id : " , props.id);
    if (props.DisplayRoom)
    {
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
          {props.room.type === 'PROTECTED' && !props.room.chatUser ? (
                  <div>
                    <button className="text-container" onClick={() => props.setSelectedRoom(props.room)}>
                          <p className="text1">{props.room.name}</p>
                          <p className="text2">{props.message}</p>
                    </button>
                    {props.selectedRoom && props.selectedRoom.name === props.room.name
                      &&(
                      <div>
                        <input
                          type="text"
                          placeholder="Enter password"
                          name={`${props.room.name}`}
                          id={props.room.name}
                          value={props.selectedPswd}
                          onChange={props.handleSelectedPassword}
                        />
                        <button name={props.room.name} onClick={props.handleJoinWithPassword}>Join</button>
                      </div>
                    )}
                  </div>
          ) : (
            <button className="text-container" onClick={()=>props.handleRoomClick(props.room)}>
            <p className="text1">{props.room.name}</p>
            <p className="text2">{props.room.lastMessage ? props.room.lastMessage.message : ''}</p>
          </button>
          )}
        </div>
      );
    }
    else {
      return (
        <div className="simple-component">
          <div className="profile-picture">
            <img
              src={props.friend.avatar} // Replace with the path to your profile image
              alt="Profile"
              width="100%"
              height="100%"
            />
          </div>
            <button className="text-container" onClick={() => props.joindDm(props.friend.username)}>
            <p className="text1">{props.friend.username}</p>
            <p className="text2">{props.message}</p>
          </button>
        </div>
      );
    }
}