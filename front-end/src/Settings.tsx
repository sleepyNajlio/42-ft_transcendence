import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'
import UploadAndDisplayImage from './Components/uploadimage.tsx';
import { useContext, useState } from 'react';
import { UserContext } from './UserProvider.tsx';

export function Settings() {
    const {user, updateUser} = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>("Richard");

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
    return (
        <>
        
            <main className="wrapper">
                <div className="sbox ">
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
                            <input type="checkbox" className="checkbox" id="demo5"/>
                            <label htmlFor="demo5"></label>
                            <p className="sbox__checkbox-text">Enable double authetication</p>
                        </div>
                        <div className="sbox__input">
                            <label htmlFor="input">Choose a Nickname *</label>
                            <input type="text" id="input" name="input" placeholder='ex: manini manini' onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <button value="Save" className="filled bt" onClick={onSubmitSettings}> Done </button>

                    </div>
                </div>
            </main>
        </>
    )
}