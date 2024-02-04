import { useEffect, useRef, useState } from 'react';
import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Verify2FA() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [inputKolo, setInputKolo] = useState('');
  const [isntValidKolo, setIsntValidKolo] = useState<boolean>(false);

  function Verify() {
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/verify`, {
      twoFaCode: inputKolo,
    }, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          navigate('/Profile'); 
        } else {
          setInputKolo('');
        }
      })
      .catch(() => {
          setInputKolo('');
      });
      
  }
  useEffect(() => {
    if (inputKolo.length === 6) {
      Verify();
    }
  }, [inputKolo]);
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentTextbox: number
  ) => {
        var nextTextbox;
        // setIsntValidKolo(false);
        if (event.keyCode === 37) {
          nextTextbox = currentTextbox - 1;
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var currentInput = document.querySelector(
              "input:nth-child(" + currentTextbox + ")"
            );
            var nextInput = document.querySelector(
              "input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (event.keyCode === 39) {
          nextTextbox = currentTextbox + 1;
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            // if(nextTextbox)
            // {
            // }
            var currentInput = document.querySelector(
              "input:nth-child(" + currentTextbox + ")"
            );
            var nextInput = document.querySelector(
              "input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (event.keyCode === 8) {
          setInputKolo(inputKolo.slice(0, -1));
          nextTextbox = currentTextbox - 1;
          var currentInput = document.querySelector(
            "input:nth-child(" + currentTextbox + ")"
          );
          if (currentInput) {
            const currentInput = document.querySelector(
              "input:nth-child(" + currentTextbox + ")"
            ) as HTMLInputElement;
            currentInput.value = "";
          }
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var nextInput = document.querySelector(
              "input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (event.keyCode === 46) {
          nextTextbox = currentTextbox + 1;
          var currentInput = document.querySelector(
            "input:nth-child(" + currentTextbox + ")"
          );
          (currentInput as HTMLInputElement).value = "";
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var nextInput = document.querySelector(
              "input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (

          event.keyCode === 48 ||
          event.keyCode === 49 ||
          event.keyCode === 50 ||
          event.keyCode === 51 ||
          event.keyCode === 52 ||
          event.keyCode === 53 ||
          event.keyCode === 54 ||
          event.keyCode === 55 ||
          event.keyCode === 56 ||
          event.keyCode === 57 ||
          event.keyCode === 96 ||
          event.keyCode === 97 ||
          event.keyCode === 98 ||
          event.keyCode === 99 ||
          event.keyCode === 100 ||
          event.keyCode === 101 ||
          event.keyCode === 102 ||
          event.keyCode === 103 ||
          event.keyCode === 104 ||
          event.keyCode === 105
        ) {
          nextTextbox = currentTextbox + 1;
          
          var currentInput = document.querySelector(
            "input:nth-child(" + currentTextbox + ")"
            );
            var key = event.keyCode || event.which;
            var isKeypad = key >= 96 && key <= 105;
            var normalizedKeyCode = isKeypad ? key - 48 : key;
            var keyChar = String.fromCharCode(normalizedKeyCode);
            (currentInput as HTMLInputElement).value = keyChar;
            if(currentTextbox <= 6){
              setInputKolo(inputKolo + keyChar);
            }            
            if (nextTextbox <= 6) {
              if(nextTextbox === 6)
              {
              }
            var nextInput = document.querySelector(
              "input:nth-child(" + nextTextbox + ")"
            );
      
            if (currentInput && (currentInput as HTMLInputElement).value.length === 1) {
              (nextInput as HTMLInputElement)?.focus();
            }
          }
          event.preventDefault();
          return false;
        } else {
          var currentInput = document.querySelector(
            "input:nth-child(" + currentTextbox + ")"
          );
          if (currentInput && !(currentInput as HTMLInputElement).value) {
            (currentInput as HTMLInputElement).value = "";
          }
          event.preventDefault();
          return false;
        }
      }
        const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        <div className="lll">
          <div className="cercle"></div>
          {/* <input type="text" placeholder="Enter your code.." value={code} onChange={(e) => setCode(e.target.value)} /> */}
          <div className="TFnumbers" style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '20%'}}>
        {inputRefs.map((ref, index) => (
        <input style={isntValidKolo?{borderColor: 'red', boxShadow: '0 0 15px red'}: {}}
          key={index}
          ref={ref}
          onKeyDown={(event) => handleKeyPress(event, index + 1)}
        />
      ))}
        </div>
          <Button msg="Back" />
        </div>
      </section>
    </>
  )
  }


