"use client";
import { Form, Input, Button } from "design-system-toshyro";
import { Dispatch, SetStateAction } from "react";

import { v4 as uuidv4 } from "uuid";

import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { months } from "@/components/Calender";
import { toast } from "react-toastify";

export interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  month?: number;
}

export default function ModalRegister({ open, setOpen, month }: ModalProps) {
  if (!open) return;

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
          name={"name"}
          label="Nome"
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
              handleRegister(e, month);
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

export async function handleRegister(e: any, month?: number, id?: string) {
  if (!month) {
    console.error("O mês não foi especificado.");
    return; // Encerra a função se o mês não estiver especificado
  }

  const nameMonth = months.find((m) => m.number === month)?.name;

  if (!nameMonth) {
    console.error("Mês inválido ou não encontrado.");
    return; // Encerra a função se o nome do mês não for encontrado
  }

  const bruteProfit = e.sellPrice
    ? Number(e.sellPrice) - Number(e.buyPrice)
    : 0;
  const realProfit = e.sellPrice
    ? Number(e.sellPrice) * 0.91 - Number(e.buyPrice)
    : 0;
  const percentage = e.sellPrice
    ? Math.round((realProfit / Number(e.sellPrice)) * 10000) / 100
    : 0;

  try {
    const docData = {
      name: e.name,
      buyPrice: Number(e.buyPrice),
      sellPrice: e.sellPrice ? Number(e.sellPrice) : 0,
      marketUrl: e.marketUrl,
      bruteProfit: bruteProfit,
      realProfit: realProfit,
      percentage: percentage,
      highlights: 0,
    };

    await setDoc(doc(collection(db, nameMonth), id ? id : uuidv4()), docData);

    if (!id) return toast.success("Item cadastrado com sucesso!");
    toast.success("Item editado com sucesso!");
  } catch (error) {
    if (!id) return toast.error("Erro ao adicionar o item.");
    toast.error("Erro ao editar o item.");
  }
}
