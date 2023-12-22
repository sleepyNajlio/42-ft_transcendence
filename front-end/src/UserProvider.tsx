import React, { createContext, useState, useEffect, useRef } from 'react';
import { getUser, initializeUser } from './player';
import { initializeSocket, getSocket } from './socket';
import { User } from './Components/types';
import { Socket } from 'socket.io-client';

interface UserContextProps {
  user: User | null;
  socket: Socket | null;
  updateUser: (user: User) => void; // Add this line
  initialize: () => Promise<void>;
}

interface UserProviderProps {
    children: React.ReactNode;
  }
const getSessionCookies = (): string => {
  const cookies = document.cookie.split(';');
  return cookies[0];
};


export const UserContext = createContext<UserContextProps>({ 
  user: null, // Provide a default value
  updateUser: () => {}, // Provide a default function
  initialize: async () => {},
  socket: null 
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const hasInitialized = useRef(false);

  const updateUser = (newUser:any) => {
    setUser(newUser);
  };
  const initialize = async () => {
    await initializeUser().then(res => {
      console.log("User: initialize", res);
      if (res) {
        getUser().then(res => {
          if (res) {
            setUser(res);
            console.log("User: set", res);
          }
          initializeSocket(res.id_player, getSessionCookies()).then(res => {
            if (res) {
              console.log("Socket: set", res);
              setSocket(res);
            } else {
              console.error("Failed to initialize socket: ", res);
            }
          } ).catch(error => {
            console.error("Failed to initialize socket: ", error);
            return false;
          } );
        } ).catch(error => {
          console.error("Failed to get user: ", error);
          return false;
        });
        hasInitialized.current = true;
        return true;
      }
    } ).catch(error => {
      console.error("Failed to get user: ", error);
      return false;
    } );
    console.log("User: provider");
  }

  return (
    <UserContext.Provider value={{ user, updateUser, initialize, socket }}>
      {children}
    </UserContext.Provider>
  );
};