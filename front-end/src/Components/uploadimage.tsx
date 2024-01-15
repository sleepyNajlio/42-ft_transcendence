import React, { useContext, useState, useRef } from "react";
import camera from '../assets/camera.svg'
import { UserContext } from "../UserProvider";

const UploadAndDisplayImage = (props: any) => {

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Declare the fileInputRef variable

    return (
        <div style={{position: "relative"}} onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}>
                {selectedImage && (
                    <div className="sbox__cercle" style={{backgroundImage: `url(${URL.createObjectURL(selectedImage)})`}}>
                        <img src={camera} alt="camera" className="sbox__camera"/>
                    </div>
                )}
                {!selectedImage && (
                    <div className="sbox__cercle" style={{backgroundImage: `url(${props.davatar})`}}>
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
                        props.onFileChange(event.target.files ? event.target.files[0] : null);
                    }
                }}
            />
        </div>
    );
};

export default UploadAndDisplayImage;