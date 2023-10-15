import {User} from "firebase/auth";
import {addDoc, collection, doc, DocumentData, updateDoc} from "firebase/firestore";
import {months} from "@/components/Calender";
import axios from "axios";
import {db} from "../../../firebase/firebaseConfig";
import {toast} from "react-toastify";

export async function handleRegister(
  e: any,
  month?: number,
  year?: number,
  user?: User,
  userDb?: DocumentData,
  id?: string,
) {
  const nameMonth = months.find((m) => m.number === month)?.name;

  const highlight = e.highlights ? Number(e.highlights) : 0.0

  const realProfit = e.sellPrice
    ? (Number(e.sellPrice) * (1 - userDb!.sellTax)) - (Number(e.buyPrice) + highlight)
    : 0;
  const percentage = e.sellPrice
    ? Number(Math.round((realProfit / Number(e.buyPrice)) * 10000) / 100 + "")
    : 0;

  async function getItemInfos() {
    try {
      const urlParts = new URL(e.marketUrl);
      const pathParts = urlParts.pathname.split("/").filter(Boolean);
      const appID = pathParts[2];
      const marketHashName = pathParts[3];

      const apiKeyParam = new URLSearchParams({
        api_key: "GtsSVDMldcm_rRGk0gbwbZgsiY0",
      });

      const apiUrl = `https://api.steamapis.com/market/item/${appID}/${marketHashName}?${apiKeyParam}`;

      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  try {
    const infos = await getItemInfos();

    const docData = {
      name: infos.market_name,
      buyPrice: parseFloat(e.buyPrice),
      sellPrice: e.sellPrice ? parseFloat(e.sellPrice) : 0,
      marketUrl: e.marketUrl,
      realProfit: realProfit,
      percentage: percentage,
      highlights: highlight,
      image: infos.image,
    };

    if (id) {
      const docRef = doc(db, user!.uid, String(year!), nameMonth!, id); // itemId é o ID exclusivo do item a ser editado
      await updateDoc(docRef, docData);
      toast.success("Item editado com sucesso!");
      return;
    }

    await addDoc(collection(db, user!.uid, String(year!), nameMonth!), {...docData, date: new Date()});
    toast.success("Item cadastrado com sucesso!");
  } catch (error) {
    if (id) return toast.error("Erro ao editar o item.");
    toast.error("Erro ao adicionar o item.");
  }
}