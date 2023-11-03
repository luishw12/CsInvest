"use client";
import {Form, Button} from "design-system-toshyro";

import { ModalUpdate } from "../interfaces";
import {useUser} from "@/context/UserContext";
import InputCs from "@/components/inputs/Input";

export default function ModalUpdate({
  open,
  setOpen,
}: ModalUpdate) {
  const {
    dataItem,
    setViewOpen,
    handleRegister,
  } = useUser();

  if (!open || !dataItem) return;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5 dark:bg-slate-800 dark:text-slate-300">
        <h2 className="text-xl font-semibold text-center col-span-12">
          Editar Item
        </h2>

        <InputCs
          name={"name"}
          label="Nome do item"
          defaultValue={dataItem.name}
          width="col-span-12"
        />
        <InputCs
          name={"marketUrl"}
          label="Link da skin"
          defaultValue={dataItem.marketUrl}
          width="col-span-12"
        />
        <InputCs
          name={"buyPrice"}
          label="Valor da compra"
          type="number"
          defaultValue={dataItem.buyPrice}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <InputCs
          name={"sellPrice"}
          label="Valor da Venda"
          type="number"
          defaultValue={dataItem.sellPrice}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <InputCs name="highlights" hidden defaultValue={dataItem.highlights} />
        <InputCs name="sold" hidden defaultValue={dataItem.sold} />
        <div className="col-span-12 grid grid-cols-2 gap-5 mt-5">
          <Button
            onClick={() => {
              setOpen(false)
              setViewOpen(true);
            }}
            title="Cancelar"
            variant="cancel"
            type="button"
            full
          />
          <Button
            onSubmit={(e) => {
              handleRegister(e, dataItem.id);
              setOpen(false);
              setViewOpen(true);
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
