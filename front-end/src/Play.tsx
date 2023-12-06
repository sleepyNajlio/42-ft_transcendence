import { useEffect, useRef } from 'react';
import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import {io, Socket} from "socket.io-client";
import  './styles/css/main.css'
import { useState } from 'react';
import { Circle } from '@svgdotjs/svg.js';
import { useDocumentVisible } from './useDocumentVisible'; // adjust the path according to your project structure
import { Players, Ball } from './Components/types';
import game from './Components/gameLogic';
import { getSocket } from "./socket";

export function Play() {
    const isDocumentVisible = useDocumentVisible();
    const [showSbox, setShowSbox] = useState(true);
    const [showGame, setshowGame] = useState(false);    
    const [isLoading, setIsLoading] = useState(false); // Add a new state variable for loading
    const [socket, setSocket] = useState<Socket>(getSocket());
    const [players, setPlayers] = useState<Players>({});
    const bballRef = useRef<Ball>({
      cercle: new Circle(),
      vx: 0,
      vy: 0,
      cx: 0,
      cy: 0,
    });
    const handleFriendClick = async (player_id: any) => {
        socket.emit('invite', 
        {
          player_id: player_id,
        });
        setSocket(socket);
        setIsLoading(true);
    };
    const handleMatchClick = async () => {
      socket.emit('matchmaking', { id: socket.id });
      setIsLoading(true);
    };

    useEffect(() => {
      let isCancelled = false;
      if (isDocumentVisible && !isCancelled) {
        if (socket)
        {
          socket.emit('documentVisible', { id: socket.id });
        }
      }
      return () => {
        isCancelled = true;
      };
    }, [isDocumentVisible]);

    useEffect(() => {
      if (socket) {
        socket.on('connect', () => {
          console.log('a user connected');
        });
        socket.on('startGame', ({players, bball}) => {
          setIsLoading(false); // Set loading to false when the game starts
          setShowSbox(false);
          setshowGame(true);
          setPlayers(players);
          console.log('start game', bball, 'players: ', players);
          bballRef.current = bball;
        });
      }
    });
    useEffect(() => {

      if (showGame && socket) {
        console.log('ball: ', bballRef.current);
        const cleanup = game(socket, players, bballRef.current);
        return () => {
          cleanup()
        };
      }
    } , [showGame]);

    return (
        <>
            <Navbar></Navbar>
            
            {showSbox && (
                <Sbox
                    btitle="Play"
                    stitle="Goat pong"
                    lb="Play with friend"
                    rb="Matchmaking"
                    isLoading = {isLoading} // Pass the loading state to the loading component
                    handleMatchClick={handleMatchClick}
                    handleFriendClick={handleFriendClick}
                >
                </Sbox>
            )}
            {showGame &&
                <div className="game_container" id="game_container">
                    <div className="pong" id="pong">
                    </div>
                </div>
            }
        </>
    );
};