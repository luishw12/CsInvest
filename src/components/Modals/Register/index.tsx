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
import { ModalRegister } from "../interfaces";
import {handleRegister} from "@/components/DbFunctions/register-edit";

export default function ModalRegister({
  year,
  open,
  setOpen,
  month,
  user,
  userDb,
}: ModalRegister) {
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
              handleRegister(e, month, year, user, userDb);
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
