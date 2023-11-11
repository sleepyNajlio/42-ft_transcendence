import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/main.css'

export function Play() {
    return (
        <>
            <Navbar></Navbar>
            <Sbox btitle="Play" stitle="Goat pong" lb="Play with friend" rb="Matchmaking"></Sbox>
        </>
    )
}