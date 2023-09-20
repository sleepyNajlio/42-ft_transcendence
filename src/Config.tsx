import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';


export function Config() {

  return (
    <>
    <section className="Config">
      <Logo></Logo>
      <div className="lll">
        <div className="cercle"></div>
        <input type="text" placeholder="username.." />
          <Button msg= "Done"/>
          <Button msg= "Enable 2FA"/>
      </div>
    </section>
    </>
  )
}

