import logo from '/logo.png'
import '../styles/css/Login.css';

function Logo(){
    return (
    <>
    <div className="logo">
        <img src={logo} alt="logo" />
    </div>
    </>
    )
}

export default Logo;