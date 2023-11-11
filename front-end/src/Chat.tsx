import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/main.css'

export function Chat() {
    return (
        <>
            <Navbar></Navbar>
            <Sbox btitle="Start new chat" stitle="Goat pong" lb="start new chat" rb="Create channel"></Sbox>
        </>
    )
}