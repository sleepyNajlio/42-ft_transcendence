import React, { useContext, useState, useRef } from "react";
import camera from '../assets/camera.svg'
import { UserContext } from "../UserProvider";
import axios from "axios";

const UploadAndDisplayImage = (props: any) => {

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Declare the fileInputRef variable

    async function uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });

            setSelectedImage(response.data);
            props.setuserpre({...props.userpre, avatar: response.data});
            // Handle response here
            console.log(response.data);
        } catch (error) {
            // Handle error here
            console.error(error);
        }
    }

    return (
        <div style={{position: "relative"}} onClick={() => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }}}>
                {selectedImage && (
                    <div className="sbox__cercle" style={{backgroundImage: `url(${selectedImage})`, width: props.width , height: props.width}}>
                        <img src={camera} alt="camera" className="sbox__camera"/>
                    </div>
                )}
                {!selectedImage && (
                    <div className="sbox__cercle" style={{backgroundImage: `url(${props.davatar})`, width: props.width , height: props.width}}>
                        <img src={camera} alt="camera" className="sbox__camera"/>
                    </div>
                )}
            <input
                ref={fileInputRef} // Use the fileInputRef
                style={{visibility: "hidden", position: "absolute", left: "0", top: "0", width: "100%", height: "100%", cursor: "pointer"}}
                type="file"
                name="myImage"
                onChange={(event) => {
                    if (event.target.files)
                    {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0] ? event.target.files[0] : null);
                        uploadImage(event.target.files[0]);
                        props.onFileChange(event.target.files ? event.target.files[0] : null);
                    }
                }}
            />
        </div>
    );
};

export default UploadAndDisplayImage;