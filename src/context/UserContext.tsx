"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  DocumentData,
  collection,
  onSnapshot,
  OrderByDirection,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc, deleteDoc
} from "firebase/firestore";
import Simulation from "@/components/Modals/Simulation";
import Configurations from "@/components/Modals/Configurations";
import ModalAporte from "@/components/Modals/Aporte";
import ModalRegister from "@/components/Modals/Register";
import ModalView from "@/components/Modals/View";
import ModalUpdate from "@/components/Modals/Update";
import ModalViewImage from "@/components/Modals/ItemImage";
import {months} from "@/components/Calender";
import {toast} from "react-toastify";
import axios from "axios";

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
  handleRegister:  (e:any, id?:string) => void;
  editHighlights:  (item:any) => void;
  editSold:  (item:any) => void;
  handleDelete:  (id:string) => void;
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
  const [monthName, setMonthName] = useState<string>();
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
    if (user) {
      const collectionRef = collection(db, user.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setUserDb({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const nameMonth = months.find((m) => m.number === monthSelected)?.name;
      const collectionRef = collection(
        db,
        user!.uid,
        year.toString(),
        nameMonth!
      );

      const queryData = query(collectionRef, orderBy(tableOrderBy.field, tableOrderBy.direction));

      onSnapshot(queryData, (querySnapshot) => {
        const documents: any = [];
        querySnapshot.forEach((docSnapshot) => {


          documents.push({...docSnapshot.data(), id: docSnapshot.id});
        })
        setInfos(documents);
      });
    }

    setMonthName(months.find(i => i.number == monthSelected)?.name)
  }, [monthSelected]);

  async function handleRegister(e: any, id?: string) {
    const realProfit = (Number(e.sellPrice) * (1 - userDb!.sellTax)) - (Number(e.buyPrice) + (e.highlights ? 2 : 0));

    const percentage = Number(Math.round((realProfit / Number(e.buyPrice)) * 10000) / 100);

    try {
      const infos = await getItemInfos(e.marketUrl);

      const docData = {
        name: infos.market_name,
        buyPrice: parseFloat(e.buyPrice),
        sellPrice: parseFloat(e.sellPrice),
        marketUrl: e.marketUrl,
        realProfit: realProfit,
        percentage: percentage,
        highlights: !!e.highlights,
        sold: !!e.sold,
        image: infos.image,
      };

      if (id) {
        const docRef = doc(db, user!.uid, String(year!), monthName!, id); // itemId é o ID exclusivo do item a ser editado
        await updateDoc(docRef, docData);
        toast.success("Item editado com sucesso!");
        return;
      }

      await addDoc(collection(db, user!.uid, String(year!), monthName!), {...docData, date: new Date()});
      toast.success("Item cadastrado com sucesso!");

    } catch (error) {
      if (id) return toast.error("Erro ao editar o item.");
      toast.error("Erro ao adicionar o item.");
    }
  }

  async function getItemInfos(marketUrl: string) {
    const urlParts = new URL(marketUrl);
    const pathParts = urlParts.pathname.split("/").filter(Boolean);
    const appID = pathParts[2];
    const marketHashName = pathParts[3];

    const apiKeyParam = new URLSearchParams({
      api_key: "GtsSVDMldcm_rRGk0gbwbZgsiY0",
    });

    const apiUrl = `https://api.steamapis.com/market/item/${appID}/${marketHashName}?${apiKeyParam}`;

    const response = await axios.get(apiUrl);
    return response.data;
  }

  async function editHighlights(item:any) {
    const highlights = !item.highlights;

    const realProfit = (Number(item.sellPrice) * (1 - userDb!.sellTax)) - (Number(item.buyPrice) + (highlights ? 2 : 0));

    const percentage = Number(Math.round((realProfit / Number(item.buyPrice)) * 10000) / 100);

    const newData = { ...item };
    delete newData.id;

    const docData = {
      ...newData,
      highlights: highlights,
      realProfit: realProfit,
      percentage: percentage,
    };

    const docRef = doc(db, user!.uid, String(year!), monthName!, item.id); // itemId é o ID exclusivo do item a ser editado
    await updateDoc(docRef, docData);
  }

  async function editSold(item:any) {
    const newData = { ...item };
    delete newData.id;

    const sold = !item.sold;

    const docData = {
      ...newData,
      sold: sold
    };

    const docRef = doc(db, user!.uid, String(year!), monthName!, item.id); // itemId é o ID exclusivo do item a ser editado
    await updateDoc(docRef, docData);
  }

  async function handleDelete(id: string) {
    const year = new Date().getFullYear().toString();

    if (confirm("Tem certeza que deseja deletar este item?"))
      try {
        const docRef = doc(db, user!.uid, year, monthName!, id);
        await deleteDoc(docRef);
        toast.success("Item excluido com sucesso!");
      } catch (err: any) {
        toast.error("Erro ao excluir o item: ", err);
      }
  }

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
        handleRegister,
        editHighlights,
        editSold,
        handleDelete,
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
