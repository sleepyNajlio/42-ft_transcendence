import React, { createContext, useState, useEffect, useRef } from 'react';
import { getUser, initializeUser } from './player';
import { initializeSocket, getSocket } from './socket';
import { User } from './Components/types';
import { Socket } from 'socket.io-client';

interface UserContextProps {
  user: User | null;
  socket: Socket | null;
}

interface UserProviderProps {
    children: React.ReactNode;
  }
const getSessionCookies = (): string => {
  const cookies = document.cookie.split(';');
  return cookies[0];
};
const initialize: () => Promise<User | null> = async () => {
    await initializeUser();
    let user: User | null = null;
    try {
        user = await getUser();
        if (user) {
            initializeSocket(user.id_player, getSessionCookies());
        }
    } catch (error) {
        console.error("user Provider: Failed to get user: ", error);
    }
    return user;
}

export const UserContext = createContext<UserContextProps>({ user: null, socket: null });

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      initialize().then(res => {
        if (res) {
          setUser(res);
          setSocket(getSocket());
        } else {
          console.error("user Provider: Failed to initialize: ", res);
        }
      }).catch(error => {
        console.error("user Provider: Failed to initialize: ", error);
      });
      hasInitialized.current = true;
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, socket }}>
      {children}
    </UserContext.Provider>
  );
};