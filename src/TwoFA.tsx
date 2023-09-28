import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';


export function TwoFA() {

  return (
    <>
    <section className="Config">
      <Logo name={''}></Logo>
      <div className="lll">
        <div className="cercle"></div>
        <input type="text" placeholder="Enter your phone number.." />
          <Button msg= "Next"/>
          <Button msg= "Back"/>
      </div>
    </section>
    </>
  )
}

