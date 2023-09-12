"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";

type UserContextProps = {
  user: User | null;
};

export const UserContext = createContext({} as UserContextProps);
export const useUser = () => useContext(UserContext);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
