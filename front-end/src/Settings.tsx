import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'
import UploadAndDisplayImage from './Components/uploadimage.tsx';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserProvider.tsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TwoFA } from './TwoFA.tsx';
import { UserProvider } from './UserProvider.tsx';

export async function turnOffTwoFactorAuth() {
    await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/turn-off`, { withCredentials: true })
    .then(response => {
      console.log(response.data);
    })
  }
export function Settings() {
    const {user, updateUser} = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>(user?.username || " ");
    const [isTwoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
    const[twoFA, setTwoFa] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        if (user)
            setUsername(user.username);
    }, [user]);

    const handleFileChange = (selectedFile: File | null) => {
        // You can now use the selectedFile in the parent component as needed.
        console.log('Selected File:', selectedFile);
        setSelectedFile(selectedFile);
    };

    const onSubmitSettings = async () => {

        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/updateUsername`, { username }, {withCredentials: true})
        .then((response) => {
            // console.log("helloo", response.data.user);
            updateUser(response.data.user);
        }).catch((error) => {
            console.log(error);
        });
        // updateUser({username: username});
        // navigate('/Profile');
    }
    const checkTwoFactorAuth = async () => {
        // Replace with your actual API endpoint
        await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/check`, {withCredentials: true})
        .then((response) => {
            // console.log('2FA enabled:', response.data);
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
                            <UploadAndDisplayImage davatar={user?.avatar} onFileChange={handleFileChange} width={70}></UploadAndDisplayImage>
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
                            <label htmlFor="input">Choose a Nickname </label>
                            <input type="text" id="input" name="input" placeholder='ex: John Doe' onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <button value="Save" className="filled bt" onClick={onSubmitSettings}> Done </button>
                    </div>
                </div> }
                {twoFA && <TwoFA user={user} onDone={TwofaDone} />}
            </main>
        </>
    )
}