"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";

type UserContextProps = {
  user: User | null;
  userDb?: DocumentData;
};

export const UserContext = createContext({} as UserContextProps);
export const useUser = () => useContext(UserContext);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userDb, setUserDb] = useState<DocumentData>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setUserDb({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        userDb,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
