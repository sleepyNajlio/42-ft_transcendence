import { useState } from 'react';
import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Verify2FA() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  function Verify() {
    axios.post('http://localhost:3000/auth/twofa/verify', {
      twoFaCode: code,
    }, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          navigate('/Profile'); 
        } else {
          console.log("Wrong code");
        }
      })
      .catch(() => {
        console.log("Wrong code");
      });
  }

  return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        <div className="lll">
          <div className="cercle"></div>
          <input type="text" placeholder="Enter your code.." value={code} onChange={(e) => setCode(e.target.value)} />
          <Button msg="Verify" onClick={Verify} />
          <Button msg="Back" />
        </div>
      </section>
    </>
  )
  }


