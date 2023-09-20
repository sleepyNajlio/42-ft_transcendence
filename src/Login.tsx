import Logo from './Components/Logo';
import ftlogo from '/ftlogo.png';
import raketa from "/raketa.png";
import Button from './Components/Button'
import './styles/css/Login.css';

export function Login() {

  return (
    <>
    <section className="sidebar">
      <Logo></Logo>
      <div className="signin">
        <div className="ftlogo">
          <img src={ftlogo} alt="ftlogo" />
        </div>
          <Button msg= "Sign in with intra"/>
      </div>
    </section>
    <main className="main">
      <div className="raketa">
        <img src={raketa} alt="raketa" />
      </div>
    </main>
    </>
  )
}

