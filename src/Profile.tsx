import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'

export function Profile() {
    return (
        <>
            <Navbar></Navbar>
            <main className="wrapper profil">
                <h1 className="rank__title">Profil</h1>
            </main>
        </>
    )
}