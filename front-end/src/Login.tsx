import Logo from './Components/Logo';
import ftlogo from '/ftlogo.png';
import raketa from "/raketa.png";
import Button from './Components/Button'
import './styles/css/Login.css';
import { useLocation } from 'react-router-dom';



export function Login() {

  // const location = useLocation();
  // const code = 
  // const state = new URLSearchParams(location.search).get('state');

  // console.log(`cooode: ${code}`);
  // console.log(`state: ${state}`);


  

  return (
    <>
    <section className="sidebar">
      <Logo name={''}></Logo>
      <div className="signin">
        <div className="ftlogo">
          <img src={ftlogo} alt="ftlogo" />
        </div>
          <Button msg= "Sign in with intra"/>
      </div>
    </section>
    <main className="cmain">
      <div className="raketa">
        <img src={raketa} alt="raketa" />
      </div>
    </main>
    </>
  )
}
