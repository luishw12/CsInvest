"use client";
import { Form, Input, Button } from "design-system-toshyro";
import { Dispatch, SetStateAction } from "react";

import { collection, addDoc } from "firebase/firestore";
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

async function handleRegister(e: any, month?: number) {
  const nameMonth = months.find((m) => m.number === month)?.name;

  const bruteProfit = e.sellPrice
    ? Number(e.sellPrice) - Number(e.buyPrice)
    : 0;
  const realProfit = e.sellPrice
    ? Number(e.sellPrice) * 0.91 - Number(e.buyPrice)
    : 0;
  const porcentage = e.sellPrice ? realProfit / Number(e.sellPrice) : 0;

  if (nameMonth) {
    try {
      await addDoc(collection(db, nameMonth), {
        name: e.name,
        buyPrice: Number(e.buyPrice),
        sellPrice: e.sellPrice ? Number(e.sellPrice) : 0,
        marketUrl: e.marketUrl,
        bruteProfit: bruteProfit,
        realProfit: realProfit,
        porcentage: porcentage,
        highlights: 0,
      });

      toast.success("Item cadastrado com sucesso!");
    } catch (e: any) {
      toast.error("Erro ao adicionar item: ", e);
    }
  }
}
