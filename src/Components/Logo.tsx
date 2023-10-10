import logo from '/logo.png'
import '../styles/css/Login.css';

type htmlclass = {
    name: string;
  }

function Logo(props : htmlclass){
    return (
    <>
    <div className={props.name || "logo"}>
        <img src={logo} alt="logo" />
    </div>
    </>
    )
}

export default Logo;