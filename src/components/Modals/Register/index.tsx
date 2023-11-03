"use client";
import {Form, Button} from "design-system-toshyro";

import { ModalRegister } from "../interfaces";
import {useUser} from "@/context/UserContext";
import InputCs from "@/components/inputs/Input";

export default function ModalRegister({
  open,
  setOpen,
}: ModalRegister) {
  const {user, userDb, handleRegister} = useUser();

  if (!open || !user || !userDb) return;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5 dark:bg-slate-800 dark:text-slate-300">
        <h2 className="text-xl font-semibold text-center col-span-12">
          Cadastrar Item
        </h2>

        <InputCs
          name={"name"}
          label="Nome do item"
          width="col-span-12"
        />
        <InputCs
          name={"marketUrl"}
          label="Link da skin"
          width="col-span-12"
        />
        <InputCs
          name={"buyPrice"}
          label="Valor da compra"
          type="number"
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <InputCs
          name={"sellPrice"}
          label="Valor da Venda"
          type="number"
          validation={{ required: "Este campo é obrigatório" }}
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
              handleRegister(e);
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
