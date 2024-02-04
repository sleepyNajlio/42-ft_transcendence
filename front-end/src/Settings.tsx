import  './styles/css/main.css'
import UploadAndDisplayImage from './Components/uploadimage.tsx';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserProvider.tsx';
import axios from 'axios';
import { TwoFA } from './TwoFA.tsx';
import { error } from 'console';


export async function turnOffTwoFactorAuth() {
    await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/turn-off`, { withCredentials: true })
    .then(response => {
    })
  }
export function Settings() {
    const {user, updateUser} = useContext(UserContext);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [username, setUsername] = useState<string>(user?.username || " ");
    const [isTwoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
    const[twoFA, setTwoFa] = useState(false);
    const [error, setError] = useState<Boolean>(false);
    // const navigate = useNavigate();

    useEffect(() => {
        if (user)
            setUsername(user.username);
    }, [user]);

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
            setError(true)
            return null;
        }
      }

    const onSubmitSettings = async () => {
        let avatar : string | null = null;
        setError(false)
        if (selectedImage)
            avatar = await uploadImage(selectedImage);
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/updateUsername`, { username }, {withCredentials: true})
        .then((response) => {
            if (response.data.user) {
                updateUser(response.data.user);
            }

        }).catch(() => {
            setError(true)
        });
    }
    const checkTwoFactorAuth = async () => {
        // Replace with your actual API endpoint
        await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/twofa/check`, {withCredentials: true})
        .then((response) => {
            setTwoFactorAuthEnabled(response.data.isTwoFaEnabled);
        })
        .catch(() => {
            setError(true);
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
                    {
                        error && 
                        (
                            <div className="sbox__title">
                                <h1 className="btitle" style={{color: "red"}}>Error</h1>
                            </div>
                        )
                    }
                    <div className="bbox">
                        <div className="sbox__user">
                        <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} davatar={user?.avatar} width={70} ></UploadAndDisplayImage>
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
                        <div className="bt">
                            <a onClick={onSubmitSettings}> Done </a>
                        </div>
                    </div>
                </div> }
                {twoFA && <TwoFA user={user} onDone={TwofaDone} />}
            </main>
        </>
    )
}