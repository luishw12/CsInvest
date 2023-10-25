"use client";
import {Form, Input, Button} from "design-system-toshyro";

import { ModalUpdate } from "../interfaces";
import {useUser} from "@/context/UserContext";

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
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5">
        <h2 className="text-xl font-semibold text-center col-span-12">
          Editar Item
        </h2>

        <Input
          name={"marketUrl"}
          label="Link da skin"
          defaultValue={dataItem.marketUrl}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-12"
        />
        <Input
          name={"buyPrice"}
          label="Valor da compra"
          type="number"
          defaultValue={dataItem.buyPrice}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <Input
          name={"sellPrice"}
          label="Valor da Venda"
          type="number"
          defaultValue={dataItem.sellPrice}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <Input name="highlights" hidden defaultValue={dataItem.highlights} />
        <Input name="sold" hidden defaultValue={dataItem.sold} />
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
