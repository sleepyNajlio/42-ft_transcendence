import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';



export function TwoFA(props: any) {
  // axios.get(`http://localhost:3000/auth/twofa/generate/${props.userpre.id}/${ props.userpre.email}`, { withCredentials: true })
  // .then(response => {
  //   console.log(response.data);
  // })
  // .catch(error => {
  //   console.error('There was an error!', error);
  // });
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
  return (
    <>
      <div className="lll">
        {/* <div className="cercle"></div> */}
        <img src={`http://localhost:3000/auth/twofa/generate/${props.userpre.id}/${ props.userpre.email}`} alt="Profile"/>
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
          onKeyDown={(e) => handleInputChange(index, e)}
        />
      ))}
        </div>
          <Button msg= "Next"/>
          <Link to="/profile"> <Button msg= "Skip"/> </Link>
      </div>
    </>
  )
}
