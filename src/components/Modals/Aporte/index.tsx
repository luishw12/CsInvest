"use client";
import { ModalAporte } from "../interfaces";
import ModalLayout from "../_Layout";
import {formatBrl, months} from "@/components/Calender";
import {Button, Form} from "design-system-toshyro";
import {handleUpdateAporte} from "@/components/DbFunctions/aporte-profit";
import {useUser} from "@/context/UserContext";
import InputCs from "@/components/inputs/Input";

export default function ModalAporte({
  open,
  setOpen,
}: ModalAporte) {
  const {user, year, monthSelected, userDb} = useUser();

  const selectedMonth = months.find(i => i.number == monthSelected)

  if (!open || !user || !selectedMonth || !year || !userDb) return;

  return (
    <ModalLayout setOpen={setOpen} title={`Aporte de ${selectedMonth?.name}`}>
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5 min-w-[500px] dark:bg-slate-800">
        <h3 className={"col-span-12 text-center font-bold text-3xl my-4"}>{formatBrl(userDb.aporte && userDb.aporte[year][selectedMonth.name] || 0)}</h3>
        <InputCs
          name={"aporte"}
          label="Aporte"
          type={"number"}
          width="col-span-12"
        />
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$250,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "250"}, "aporte", monthSelected!, year, user, userDb, "add")}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$500,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "500"}, "aporte", monthSelected!, year, user, userDb, "add")}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$1.000,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "1000"}, "aporte", monthSelected!, year, user, userDb, "add")}
          />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            title={"Remover"}
            onSubmit={(e) =>
              handleUpdateAporte(e, "aporte", monthSelected!, year, user, userDb, "remove")}
            color={"bg-red-500 hover:bg-red-600"} />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            onSubmit={(e) =>
              handleUpdateAporte(e, "aporte", monthSelected!, year, user, userDb, "add")}
            title={"Adicionar"} />
        </div>
      </Form>
    </ModalLayout>
  );
}