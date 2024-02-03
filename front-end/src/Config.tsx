import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import Cookies from 'js-cookie';
import { User } from './Components/types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserProvider';
import { TwoFA } from './TwoFA';
import UploadAndDisplayImage from './Components/uploadimage';
import axios from 'axios';

async function finishSignup(email: string, username: string, avatar: string): Promise<any> {
  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/finish_signup`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        avatar: avatar,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", username, email, avatar);
    console.error("Error:", error);
  }
}

async function getPreAuthData() {
  const cookie = Cookies.get(); // Get all cookies
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: Object.entries(cookie) // Get all cookies and format them
        .map(([name, value]) => `${name}=${value}`)
        .join("; "),
    },
  });
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    alert("Failed to get pre-auth data");
  }
}

export function Config() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const[twoFA, setTwoFa] = useState(false);
  const [userpre, setUserpre] = useState<{id: String, email: string, username: string, avatar: string}>({id : "" ,email: "", username: "", avatar: ""});
  const navigate = useNavigate();
  const [newUsername, setUsername] = useState<string>("");
  const [error, setError] = useState<Boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      await getPreAuthData().then(res => {
        if (res) {
          console.log("username set to: ", res);
          setUserpre ({id : res.id_player, email: res.email, username: res.username, avatar: res.avatar});
          setUsername(res.username);
        }
      }
      ).catch(() => {
        setError(true);
        return false;
      });
    };
    fetchData();
  }, []);


  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
        });
        return response.data as string;
    } catch {
        // Handle error here
        setError(true);
        return null;
    }
  }

  const submitForm = async (path: string) => {
    console.log('form userpre:', userpre);
    let avatar : string | null = null;
    if (selectedImage)
      avatar = await uploadImage(selectedImage);
    try {
      const res = await finishSignup(userpre.email, newUsername || "", avatar || userpre.avatar);
      console.log("sign up", res);
      navigate(path);
    } catch {
      setError(true);
      // Handle the error or return false if needed
    }
  };



return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        {
          !twoFA && userpre && (
          <div className="lll">
            {
              error && 
              (
                <div className="sbox__title">
                    <h1 className="btitle" style={{color: "red"}}>Error</h1>
                </div>
              )
            }
            <form onSubmit={(e) => e.preventDefault()} style={{display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center'}}>
              <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} davatar={userpre.avatar} width={200} ></UploadAndDisplayImage>
              <input
                  required
                  type="text"
                  placeholder="Username"
                  defaultValue={userpre.username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
              ></input>
              <Button value="/Profile" link="#" msg="Done" onClick={() => submitForm('/Profile')}/>
            </form>
            <Button value="/TwoFA" link="#" msg="Enable 2FA" onClick={() => setTwoFa(true)}/>
          </div>
          )
        }
        
        {twoFA && <TwoFA userpre={userpre} onDone={() => setTwoFa(false)}  />}
      </section>
    </>
  )
}

