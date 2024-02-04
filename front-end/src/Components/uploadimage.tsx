import { useState, useRef, useEffect } from "react";
import camera from '../assets/camera.svg'
import axios from "axios";

const UploadAndDisplayImage = (props: any) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>();
    useEffect(() => {
        if (props.selectedImage === null) {
            return;
        }
        const objectUrl = URL.createObjectURL(props.selectedImage)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [props.selectedImage])


    return (
        <div style={{position: "relative"}} onClick={() => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }}}>
                    <div className="sbox__cercle" style={{backgroundImage: `url(${preview || props.davatar})`, width: props.width , height: props.width}}>
                        <img src={camera} alt="camera" className="sbox__camera"/>
                    </div>
            <input
                ref={fileInputRef} // Use the fileInputRef
                style={{visibility: "hidden", position: "absolute", left: "0", top: "0", width: "100%", height: "100%", cursor: "pointer"}}
                type="file"
                name="myImage"
                onChange={(event) => {
                    if (event.target.files)
                    {
                        props.setSelectedImage(event.target.files[0] ? event.target.files[0] : null);
                    }
                }}
            />
        </div>
    );
};

export default UploadAndDisplayImage;