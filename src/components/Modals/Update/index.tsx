"use client";
import { Form, Input, Button } from "design-system-toshyro";

import { ModalProps, handleRegister } from "../Register";

interface ModalUpdate extends ModalProps {
  data: any;
}

export default function ModalUpdate({
  open,
  setOpen,
  month,
  data,
}: ModalUpdate) {
  if (!open || !data) return;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5">
        <h2 className="text-xl font-semibold text-center col-span-12">
          Editar Item
        </h2>

        <Input
          name={"marketUrl"}
          label="Link da skin"
          defaultValue={data.marketUrl.stringValue}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-12"
        />
        <Input
          name={"name"}
          label="Nome"
          defaultValue={data.name.stringValue}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-12"
        />
        <Input
          name={"buyPrice"}
          label="Valor da compra"
          type="number"
          defaultValue={data.buyPrice.integerValue || data.buyPrice.doubleValue}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-6"
        />
        <Input
          name={"sellPrice"}
          label="Valor da Venda"
          type="number"
          defaultValue={
            data.sellPrice.integerValue || data.sellPrice.doubleValue
          }
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
              handleRegister(e, month, data.id);
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
