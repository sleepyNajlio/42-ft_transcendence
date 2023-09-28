import logo from '/logo.png'
import '../styles/css/Login.css';

const htmlclass={
    name: "logo"
}

function Logo(props : typeof htmlclass){
    return (
    <>
    <div className={props.name || "logo"}>
        <img src={logo} alt="logo" />
    </div>
    </>
    )
}

export default Logo;