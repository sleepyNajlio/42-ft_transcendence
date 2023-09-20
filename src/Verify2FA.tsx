import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';


export function Verify2FA() {

  return (
    <>
    <section className="Config">
      <Logo></Logo>
      <div className="lll">
        <div className="cercle"></div>
        <input type="text" placeholder="Enter your code.." />
          <Button msg= "Verify"/>
          <Button msg= "Back"/>
      </div>
    </section>
    </>
  )
}

