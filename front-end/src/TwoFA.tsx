import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




export function TwoFA(props: any) {
    const navigate = useNavigate();

    const digitInputs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
  
      // Move focus to the next input
      if (value.length === 1 && index < digitInputs.length) {
        digitInputs[index].current?.focus();
      }
  
      // Move focus to the previous input on backspace
      if ((event as KeyboardEvent).key === 'Backspace' && index > 0) {
        digitInputs[index].current?.focus();
      }
    };

    const verify2Fa = async () => {
      const code = digitInputs.map(input => input.current?.value).join('');
      console.log(code);
      axios.post(`http://localhost:3000/auth/twofa/turn-on`, {"twoFaCode":code}, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data.success)
          navigate(-1);
        else
          alert("Wrong code");
      })
      
    }
  return (
    <>
      <div className="lll">
        {/* <div className="cercle"></div> */}
        <img src={`http://localhost:3000/auth/twofa/generate`} alt="Profile"/>
        {/* <input type="number" placeholder="Enter your phone number.." /> */}
        <div className="TFnumbers" style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '20%'}}>
        {digitInputs.map((inputRef, index) => (
        <input
          key={index}
          type="text"
          className="digit-input"
          maxLength={1}
          required
          ref={inputRef}
            onChange={(e) => handleInputChange(index + 1, e)}
          onKeyDown={(e) => { 
            if (e.key === 'Backspace' && e.currentTarget.value === '') {
              if (index === 0) {
                return;
              }
                const previousField = digitInputs[index - 1].current;
              if (previousField) {
                previousField.focus();
              }
            } else {
              handleInputChange(index, e);
            }}}
        />
      ))}
        </div>
          <Button msg= "Next" onClick={verify2Fa}/>
          <Link to="/profile"> <Button msg= "Skip"/> </Link>
      </div>
    </>
  )
}
