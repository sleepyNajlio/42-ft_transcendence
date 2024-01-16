import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import Cookies from 'js-cookie';
import { User } from './Components/types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserProvider';

async function finishSignup(email: string, username: string, avatar: string): Promise<any> {
  // if (avatar) {
  //   const formData = new FormData();
  //   formData.append("avatar", avatar);
  //   const response = await fetch("http://localhost3000/auth/uploadAvatar", {
  //     credentials: "include",
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     alert("File upload failed.");
  //   }
  //}
  try {
    const response = await fetch("http://localhost:3000/auth/finish_signup", {
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
    throw error; // Rethrow the error to be caught by the calling code
  }
}

async function getPreAuthData() {
  const cookie = Cookies.get(); // Get all cookies
  const response = await fetch("http://localhost:3000/user", {
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
  const { user, initialize } = useContext(UserContext);

  const [userpre, setUserpre] = useState<{email: string, username: string, avatar: string}>({email: "", username: "", avatar: ""});
  const navigate = useNavigate();
  const [newUsername, setUsername] = useState<string>("kkkk");
  
  useEffect(() => {
    const fetchData = async () => {
      await getPreAuthData().then(res => {
        if (res) {
          console.log("username set to: ", res.username);
          setUserpre ({email: res.email, username: res.username, avatar: res.avatar});
          setUsername(res.username);
        }
      }
      ).catch(error => {
        console.error("Failed to get user: ", error);
        return false;
      });
    };
    fetchData();
  }, []);

  const submitForm = async (path: string) => {
    console.log('form userpre:', userpre);
    try {
      const res = await finishSignup(userpre.email, newUsername || "", userpre.avatar);
      console.log("sign up", res);
      initialize();
      navigate(path);
    } catch (error) {
      console.error("Failed to finish signup: ", error);
      // Handle the error or return false if needed
    }
  };
  


return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        <div className="lll">
          <div className="cercle" style={{ backgroundImage: `url(${userpre.avatar})` }}>
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center'}}>
            <input
                required
                type="text"
                placeholder="Username"
                defaultValue={userpre.username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
            ></input>
            <button value="/profile" type="submit" onClick={() => submitForm('/profile')}> Done </button>
            <Button value="/TwoFA" link="#" msg="Enable 2FA" onClick={() => submitForm('/TwoFA')}/>
          </form>
        
        </div>
      </section>
    </>
  )
}

