import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import { Link } from 'react-router-dom';


export function TwoFA() {

  return (
    <>
    <section className="Config">
      <Logo name={''}></Logo>
      <div className="lll">
        {/* <div className="cercle"></div> */}
        <input type="text" placeholder="Enter your phone number.." />
          <Button msg= "Next"/>
          <Link to="/profile"> <Button msg= "Skip"/> </Link>
      </div>
    </section>
    </>
  )
}

