"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import {DocumentData, collection, onSnapshot, OrderByDirection} from "firebase/firestore";
import Simulation from "@/components/Modals/Simulation";
import Configurations from "@/components/Modals/Configurations";
import ModalAporte from "@/components/Modals/Aporte";
import ModalRegister from "@/components/Modals/Register";
import ModalView from "@/components/Modals/View";
import ModalUpdate from "@/components/Modals/Update";
import ModalViewImage from "@/components/Modals/ItemImage";

type UserContextProps = {
  user: User | null;
  userDb?: DocumentData;
  year: number;
  infos: any;
  dataItem: any;
  tableOrderBy: { field: string, direction: OrderByDirection };
  monthSelected: number | undefined;
  setMonthSelected:  Dispatch<SetStateAction<number | undefined>>;
  setInfos:  Dispatch<SetStateAction<any>>;
  setYear:  Dispatch<SetStateAction<number>>;
  setDataItem:  Dispatch<SetStateAction<any>>;
  setOrderBy:  Dispatch<SetStateAction<{ field: string, direction: OrderByDirection }>>;
  setOpenSimulation:  Dispatch<SetStateAction<boolean>>;
  setOpenConfig:  Dispatch<SetStateAction<boolean>>;
  setAporteOpen:  Dispatch<SetStateAction<boolean>>;
  setRegisterOpen:  Dispatch<SetStateAction<boolean>>;
  setViewOpen:  Dispatch<SetStateAction<boolean>>;
  setEditOpen:  Dispatch<SetStateAction<boolean>>;
  setViewImageOpen:  Dispatch<SetStateAction<boolean>>;
};

export const UserContext = createContext({} as UserContextProps);
export const useUser = () => useContext(UserContext);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userDb, setUserDb] = useState<DocumentData>();

  const [tableOrderBy, setOrderBy] =
    useState<{ field: string, direction: OrderByDirection }>({field: "date", direction: "desc"});

  const [infos, setInfos] = useState<any>();
  const [year, setYear] = useState<number>(
    new Date().getFullYear()
  );
  const [monthSelected, setMonthSelected] = useState<number>()
  const [dataItem, setDataItem] = useState<any>();

  const [openSimulation, setOpenSimulation] = useState<boolean>(false);
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const [aporteOpen, setAporteOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewImageOpen, setViewImageOpen] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    console.log(infos)
  }, [infos]);

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
        year,
        infos,
        dataItem,
        monthSelected,
        tableOrderBy,
        setInfos,
        setYear,
        setMonthSelected,
        setOpenSimulation,
        setOpenConfig,
        setAporteOpen,
        setRegisterOpen,
        setViewOpen,
        setEditOpen,
        setDataItem,
        setOrderBy,
        setViewImageOpen,
      }}
    >
      {openSimulation && (
        <Simulation
          open={openSimulation}
          setOpen={setOpenSimulation}
        />
      )}

      {openConfig && (
        <Configurations
          open={openConfig}
          setOpen={setOpenConfig}
        />
      )}

      {aporteOpen && (
        <ModalAporte
          open={aporteOpen}
          setOpen={setAporteOpen}
        />
      )}

      {registerOpen && (
        <ModalRegister
          open={registerOpen}
          setOpen={setRegisterOpen}
        />
      )}

      {viewOpen && (
        <ModalView
          open={viewOpen}
          setOpen={setViewOpen}
        />
      )}

      {editOpen && (
        <ModalUpdate
          open={editOpen}
          setOpen={setEditOpen}
        />
      )}

      {viewImageOpen && (
        <ModalViewImage
          open={viewImageOpen}
          setOpen={setViewImageOpen}
        />
      )}
      {children}
    </UserContext.Provider>
  );
}
