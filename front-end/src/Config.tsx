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
    throw error; // Rethrow the error to be caught by the calling code
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
  const { initialize } = useContext(UserContext);
  const[twoFA, setTwoFa] = useState(false);
  const [userpre, setUserpre] = useState<{id: String, email: string, username: string, avatar: string}>({id : "" ,email: "", username: "", avatar: ""});
  const navigate = useNavigate();
  const [newUsername, setUsername] = useState<string>("kkkk");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      await getPreAuthData().then(res => {
        if (res) {
          console.log("username set to: ", res);
          setUserpre ({id : res.id_player, email: res.email, username: res.username, avatar: res.avatar});
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
      navigate(path);
    } catch (error) {
      console.error("Failed to finish signup: ", error);
      // Handle the error or return false if needed
    }
  };

  const handleFileChange = (selectedFile: File | null) => {
    // You can now use the selectedFile in the parent component as needed.
    console.log('Selected File:', selectedFile);
    setSelectedFile(selectedFile);
};
  


return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        {
          !twoFA && (
          <div className="lll">
            <UploadAndDisplayImage davatar={userpre?.avatar} onFileChange={handleFileChange} width={200} userpre={userpre} setuserpre={setUserpre} ></UploadAndDisplayImage>
            {/* <div className="cercle" >
            </div> */}
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
              <Button value="/Profile" link="#" msg="Done" onClick={() => submitForm('/Profile')}/>
              <Button value="/TwoFA" link="#" msg="Enable 2FA" onClick={() => setTwoFa(true)}/>
            </form>
          </div>
          )
        }
        
        {twoFA && <TwoFA userpre={userpre} onDone={() => setTwoFa(false)}  />}
      </section>
    </>
  )
}

