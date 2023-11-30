import Logo from './Components/Logo';
import Button from './Components/Button';
import './styles/css/Config.css';
import Cookies from 'js-cookie';
import { User } from './Components/types';
import { useEffect, useState } from 'react';


async function finishSignup(
  email: string,
  username: string,
  avatar: string,
) 
  {
  // if (avatar) {
  //   const formData = new FormData();
  //   formData.append("avatar", avatar);
  //   const response = await fetch("http://localhost:3000/auth/uploadAvatar", {
  //     credentials: "include",
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     alert("File upload failed.");
  //   }
  //}
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
  if (response.ok) {
    const res = await response.json();
    console.log("res:", res);
  } else alert("Failed to Finish Signup");
}



async function getPreAuthData() {
  const cookie = Cookies.get(); // Get all cookies
  const response = await fetch("http://localhost:3000/auth/preAuthData", {
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
    return res.user;
  } else {
    alert("Failed to fetch user data");
  }
}

export function Config() {
  const [user, setUser] = useState({} as User);
  const [newUsername, setUsername] = useState<string>(user.username);

  useEffect(() => {
    const fetchData = async () => {
      const user: User = await getPreAuthData();
      setUser(user);
      setUsername(user.username);
    };

    fetchData();
    
  }, []);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    finishSignup(user.email ,newUsername , user.avatar);
    
  };
  
  return (
    <>
      <section className="Config">
        <Logo name={''}></Logo>
        <div className="lll">
          <div className="cercle" style={{ backgroundImage: `url(${user.avatar})` }}>
          </div>
          <form onSubmit={handleSubmit}>
          <input
              required
              type="text"
              placeholder="Username"
              defaultValue={newUsername}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></input>
            <button type="submit"> Done </button>
          </form>
        </div>
        <Button msg="Enable 2FA" />
      </section>
    </>
  )
}

