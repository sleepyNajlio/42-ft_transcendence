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
          <Button msg= "Sign in with intra" auth = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0b2bcc58478eb63964ec2151b650aff6bd22a16a91ce85a83a878c022cc63850&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2FConfig&response_type=code"/>
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

