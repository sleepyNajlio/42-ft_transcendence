import logo from '/logo.png'
import '../styles/css/Login.css';
import { Navigate, useNavigate } from 'react-router-dom';

type htmlclass = {
    name: string;
  }

  
  function  Logo(props : htmlclass){

    const Navigate = useNavigate();

    const handleLogoclick = () => {
        Navigate(`/Profile`);
    }
      return (
    <>
    <div className={props.name || "logo"} onClick={handleLogoclick} style={{ cursor: 'pointer' }} >
        <img src={logo} alt="logo" />
    </div>
    </>
    )
}

export default Logo;