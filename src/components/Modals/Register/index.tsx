"use client";
import { Form, Input, Button } from "design-system-toshyro";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { months } from "@/components/Calender";
import { toast } from "react-toastify";
import axios from "axios";
import { User } from "firebase/auth";
import { ModalProps } from "../interfaces";

export default function ModalRegister({
  open,
  setOpen,
  month,
  user,
  userDb,
}: ModalProps) {
  if (!open || !user || !userDb) return;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5">
        <h2 className="text-xl font-semibold text-center col-span-12">
          Cadastrar Item
        </h2>

        <Input
          name={"marketUrl"}
          label="Link da skin"
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-12"
        />
        <Input
          name={"buyPrice"}
          label="Valor da compra"
          type="number"
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <Input
          name={"sellPrice"}
          label="Valor da Venda"
          type="number"
          width="col-span-6"
        />
        <div className="col-span-12 grid grid-cols-2 gap-5 mt-5">
          <Button
            onClick={() => setOpen(false)}
            title="Cancelar"
            variant="cancel"
            type="button"
            full
          />
          <Button
            onSubmit={(e) => {
              handleRegister(e, month, user, userDb);
              setOpen(false);
            }}
            title="Adicionar"
            type="button"
            full
          />
        </div>
      </Form>
    </div>
  );
}

export async function handleRegister(
  e: any,
  month?: number,
  user?: User,
  userDb?: DocumentData,
  id?: string
) {
  const nameMonth = months.find((m) => m.number === month)?.name;
  const year = new Date().getFullYear().toString();

  const bruteProfit = e.sellPrice
    ? Number(e.sellPrice) - Number(e.buyPrice)
    : 0;
  const realProfit = e.sellPrice
    ? Number(e.sellPrice) * (1 - userDb!.sellTax) - Number(e.buyPrice)
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
      bruteProfit: bruteProfit,
      realProfit: realProfit,
      percentage: percentage,
      highlights: 0.0,
      image: infos.image,
    };

    if (id) {
      const docRef = doc(db, user!.uid, year, nameMonth!, id); // itemId é o ID exclusivo do item a ser editado
      await updateDoc(docRef, docData);
      toast.success("Item editado com sucesso!");
      return;
    }

    await addDoc(collection(db, user!.uid, year, nameMonth!), docData);
    toast.success("Item cadastrado com sucesso!");
  } catch (error) {
    if (id) return toast.error("Erro ao editar o item.");
    toast.error("Erro ao adicionar o item.");
  }
}
