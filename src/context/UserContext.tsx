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
import {SoldOptionsEnum} from "@/components/Modals/View/components/filter";

type UserContextProps = {
  user: User | null;
  userDb?: DocumentData;
  year: number;
  filter: string;
  soldFilter: SoldOptionsEnum;
  infos: any;
  dataItem: any;
  theme: string;
  viewItems: any;
  tableOrderBy: { field: string, direction: OrderByDirection };
  monthSelected: number | undefined;
  setMonthSelected:  Dispatch<SetStateAction<number | undefined>>;
  setInfos:  Dispatch<SetStateAction<any>>;
  setYear:  Dispatch<SetStateAction<number>>;
  setTheme:  Dispatch<SetStateAction<string>>;
  setDataItem:  Dispatch<SetStateAction<any>>;
  setOrderBy:  Dispatch<SetStateAction<{ field: string, direction: OrderByDirection }>>;
  setFilter:  Dispatch<SetStateAction<string>>;
  setSoldFilter:  Dispatch<SetStateAction<SoldOptionsEnum>>;
  setOpenSimulation:  Dispatch<SetStateAction<boolean>>;
  setOpenConfig:  Dispatch<SetStateAction<boolean>>;
  setAporteOpen:  Dispatch<SetStateAction<boolean>>;
  setViewItems:  Dispatch<SetStateAction<any>>;
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
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light")

  const [user, setUser] = useState<User | null>(null);
  const [userDb, setUserDb] = useState<DocumentData>();

  const [tableOrderBy, setOrderBy] =
    useState<{ field: string, direction: OrderByDirection }>({field: "date", direction: "desc"});
  const [filter, setFilter] = useState<string>("");
  const [soldFilter, setSoldFilter] = useState<SoldOptionsEnum>(SoldOptionsEnum.ALL);

  const [infos, setInfos] = useState<any>();
  const [viewItems, setViewItems] = useState<any>([]);

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
    const root = document.documentElement;
    const themes = ["light", "dark"]; // Lista de temas disponíveis

    // Remove todas as classes de tema existentes
    root.classList.remove(...themes);

    // Adiciona a classe do novo tema
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  useEffect(() => {
    if(!editOpen && !viewOpen) {
      setViewItems(infos);
      setFilter("")
      setSoldFilter(SoldOptionsEnum.ALL)
      setOrderBy({field: "date", direction: "desc"})
    }
  }, [editOpen, viewOpen]);

  async function handleRegister(e: any, id?: string) {
    const realProfit = (Number(e.sellPrice) * (1 - userDb!.sellTax)) - (Number(e.buyPrice) + (e.highlights ? 2 : 0));

    const percentage = Number(Math.round((realProfit / Number(e.buyPrice)) * 10000) / 100);

    async function getName(item:any) {
      if(item.name)
        return {market_name: item.name, image: ""}

      if(item.marketUrl)
        return await getItemInfos(e.marketUrl)

      toast.error("Nome ou Link obrigatório");
    }

    try {
      const infos = await getName(e);

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
        theme,
        viewItems,
        filter,
        soldFilter,
        user,
        userDb,
        year,
        infos,
        dataItem,
        monthSelected,
        tableOrderBy,
        setTheme,
        setFilter,
        setViewItems,
        setSoldFilter,
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
