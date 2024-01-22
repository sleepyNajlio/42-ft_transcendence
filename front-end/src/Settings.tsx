import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'
import UploadAndDisplayImage from './Components/uploadimage.tsx';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserProvider.tsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TwoFA } from './TwoFA.tsx';


export async function turnOffTwoFactorAuth() {
    await axios.get('http://localhost:3000/auth/twofa/turn-off', { withCredentials: true })
    .then(response => {
      console.log(response.data);
    })
  }
export function Settings() {
    const {user, updateUser} = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>("Richard");
    const [isTwoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
    const navigate = useNavigate();
    const[twoFA, setTwoFa] = useState(false);


    const handleFileChange = (selectedFile: File | null) => {
        // You can now use the selectedFile in the parent component as needed.
        console.log('Selected File:', selectedFile);
        setSelectedFile(selectedFile);
      };

    const onSubmitSettings = async () => {
        console.log("updated");
        const formData = new FormData();
        formData.append('username', username);
        if (selectedFile)
            formData.append('file', selectedFile);
        console.log(selectedFile);
        try {
            const response = await fetch(`http://localhost:3000/profile/upload/${user?.id}`, {
              method: 'POST',
              body: formData,
              credentials: "include",
            });
            // Handle the response from the server
            console.log('Server response:', response);
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        updateUser({username: username, avatar: selectedFile?.name || ""})
        // const res = await finishSignup(username, selectedFile);
        
    }
    const checkTwoFactorAuth = async () => {
        // Replace with your actual API endpoint
        await axios.get('http://localhost:3000/auth/twofa/check', {withCredentials: true})
        .then((response) => {
            console.log('2FA enabled:', response.data);
            setTwoFactorAuthEnabled(response.data.isTwoFaEnabled);
        })
        .catch((error) => {
            console.error('Failed to check 2FA:', error);
        });
    };

    const TwofaDone = () => {
        checkTwoFactorAuth();
        setTwoFa(false);
    }

    useEffect(() => {
        checkTwoFactorAuth();
    }, []);


    return (
        <>
            <main className="wrapper Config">
                {!twoFA &&  <div className="sbox ">
                    <div className="sbox__title">
                        <h1 className="btitle">Settings</h1>
                        <h3 className="stitle">Adjust your profile</h3>
                    </div>
                    <div className="bbox">
                        <div className="sbox__user">
                            {/* <div className="sbox__cercle">
                                <img src={camera} alt="camera" className="sbox__camera"/>
                            </div> */}
                            
                        <UploadAndDisplayImage davatar={user?.avatar} onFileChange={handleFileChange}></UploadAndDisplayImage>
                            <span className="sbox__name">{username}</span>
                        </div>
                        <div className="sbox__checkbox">
                        <input type="checkbox" className="checkbox" id="demo5" 
                        checked={isTwoFactorAuthEnabled} 
                        onChange={(e) => { 
                            setTwoFactorAuthEnabled(e.target.checked);
                            if (e.target.checked) {
                                setTwoFa(true);
                            } else {
                                turnOffTwoFactorAuth();
                            }
                            }}/>
                            <label htmlFor="demo5"></label>
                            <p className="sbox__checkbox-text">Enable Two Factor Authetication</p>
                        </div>
                        <div className="sbox__input">
                            <label htmlFor="input">Choose a Nickname *</label>
                            <input type="text" id="input" name="input" placeholder='ex: manini manini' />
                        </div>
                        <button value="Save" className="filled bt" onClick={onSubmitSettings}> Done </button>
                    </div>
                </div> }
                {twoFA && <TwoFA user={user} onDone={TwofaDone} />}
            </main>
        </>
    )
}