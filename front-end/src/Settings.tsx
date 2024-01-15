import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'
import camera from './assets/camera.svg'

export function Settings() {
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
                            <div className="sbox__cercle">
                                <img src={camera} alt="camera" className="sbox__camera"/>
                            </div>
                            <span className="sbox__name">Richard</span>
                        </div>
                        <div className="sbox__checkbox">
                            <input type="checkbox" className="checkbox" id="demo5"/>
                            <label htmlFor="demo5"></label>
                            <p className="sbox__checkbox-text">Enable double authetication</p>
                        </div>
                        <div className="sbox__input">
                            <label htmlFor="input">Choose a Nickname *</label>
                            <input type="text" id="input" name="input" placeholder='ex: manini manini'/>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}