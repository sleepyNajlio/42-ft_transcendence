import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import {Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useRef, ChangeEvent, KeyboardEvent, useState, useEffect } from 'react';
import { ExitStatus } from 'typescript';
import { A } from '@svgdotjs/svg.js';
import { get } from 'svg.js';



export function TwoFA(props: any) {
  const {onDone} = props;
  const [error, setError] = useState<string>('');

    const [inputKolo, setInputKolo] = useState('');
    const [isntValidKolo, setIsntValidKolo] = useState<boolean>(false);
    useEffect(() => {
      if (inputKolo.length === 6) {
        // // Assuming you want to navigate when the input length is 6
        console.log(inputKolo);
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/turn-on`, {"twoFaCode":inputKolo}, { withCredentials: true })
        .then(response => {
          console.log(response.data);
          if (response.data.success) {
            onDone();
          } else {
            setError("Wrong code");
          }
        })
        .catch(error => {
          setError("Enter a valid code");
        });
      }
    }, [inputKolo]);
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentTextbox: number
  ) => {
        // console.log(event.keyCode);
        var nextTextbox;
        // setIsntValidKolo(false);
        if (event.keyCode === 37) {
          nextTextbox = currentTextbox - 1;
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var currentInput = document.querySelector(
              ".TFnumbers input:nth-child(" + currentTextbox + ")"
            );
            var nextInput = document.querySelector(
              ".TFnumbers input:nth-child(" + nextTextbox + ")"
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
            //   console.log("6666666666666666666");
            // }
            var currentInput = document.querySelector(
              ".TFnumbers input:nth-child(" + currentTextbox + ")"
            );
            var nextInput = document.querySelector(
              ".TFnumbers input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (event.keyCode === 8) {
          setInputKolo(inputKolo.slice(0, -1));
          nextTextbox = currentTextbox - 1;
          var currentInput = document.querySelector(
            ".TFnumbers input:nth-child(" + currentTextbox + ")"
          );
          if (currentInput) {
            const currentInput = document.querySelector(
              ".TFnumbers input:nth-child(" + currentTextbox + ")"
            ) as HTMLInputElement;
            currentInput.value = "";
          }
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var nextInput = document.querySelector(
              ".TFnumbers input:nth-child(" + nextTextbox + ")"
            );
      
            (nextInput as HTMLInputElement)?.focus();
          }
          event.preventDefault();
          return false;
        } else if (event.keyCode === 46) {
          nextTextbox = currentTextbox + 1;
          var currentInput = document.querySelector(
            ".TFnumbers input:nth-child(" + currentTextbox + ")"
          );
          (currentInput as HTMLInputElement).value = "";
          if (nextTextbox >= 1 && nextTextbox <= 6) {
            var nextInput = document.querySelector(
              ".TFnumbers input:nth-child(" + nextTextbox + ")"
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
            ".TFnumbers input:nth-child(" + currentTextbox + ")"
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
                console.log("6666666666666666666");
              }
            var nextInput = document.querySelector(
              ".TFnumbers input:nth-child(" + nextTextbox + ")"
            );
            if (currentInput && (currentInput as HTMLInputElement).value.length === 1) {
              (nextInput as HTMLInputElement)?.focus();
            }
          }
          event.preventDefault();
          return false;
        } else {
          var currentInput = document.querySelector(
            ".TFnumbers input:nth-child(" + currentTextbox + ")"
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
      <div className="lll">
        {/* <div className="cercle"></div> */}
        { error && <p className="error">{error}</p> }
        <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/generate`} alt="Profile"/>
        {/* <input type="number" placeholder="Enter your phone number.." /> */}
        <div className="TFnumbers" style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '20%'}}>
        {inputRefs.map((ref, index) => (
        <input style={isntValidKolo?{borderColor: 'red', boxShadow: '0 0 15px red'}: {}}
          key={index}
          ref={ref}
          onKeyDown={(event) => handleKeyPress(event, index + 1)}
        />
      ))}
        </div>
        {/* <Button msg="Next" onClick={verify2Fa}/> */}
        <Button msg="Skip" onClick={() => onDone()}/>
      </div>
    </>
  )
}
