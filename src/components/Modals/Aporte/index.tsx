"use client";
import { ModalAporte } from "../interfaces";
import ModalLayout from "../_Layout";
import {formatBrl, months} from "@/components/Calender";
import {Button, Form, Input} from "design-system-toshyro";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {db} from "../../../../firebase/firebaseConfig";
import {toast} from "react-toastify";
import {User} from "firebase/auth";

export default function ModalAporte({
  open,
  setOpen,
  month,
  data,
  user,
  year
}: ModalAporte) {
  if (!open || !data || !user) return;

  const selectedMonth = months.find(i => i.number == month)

  return (
    <ModalLayout setOpen={setOpen} title={`Aporte de ${selectedMonth?.name}`}>
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5 min-w-[500px]">
        <h3 className={"col-span-12 text-center font-bold text-3xl my-4"}>{formatBrl(data.aporte ?? 0)}</h3>
        <Input
          name={"aporte"}
          label="Aporte"
          type={"number"}
          validation={{ required: "Este campo é obrigatório" }}
          width="col-span-12"
        />
        <div className={"col-span-6"}>
          <Button
            full
            title={"Remover"}
            onClick={(e) =>
              handleChangeAporte(e, "remove", data, month, year, user)}
            color={"bg-red-500 hover:bg-red-600"} />
        </div>
        <div className={"col-span-6"}>
          <Button full title={"Adicionar"} />
        </div>
      </Form>
    </ModalLayout>
  );
}

async function handleChangeAporte(
  e:any,
  type: "add" | "remove",
  data?: any,
  month?: number,
  year?: number,
  user?: User,
) {
  const nameMonth = months.find((m) => m.number === month)?.name;

  try {
    const docData = {
      aporte: data.aporte > 0 ? type == "add" ? data.aporte + e.aporte : data.aporte - e.aporte : 0
    };

    if(data.aporte > 0) {
      //TODO: ver como que vou editar essa bomba, preciso dar um jeito de pegar o id
      const docRef = doc(db, user!.uid, String(year!), nameMonth!, id);
      await updateDoc(docRef, docData);
      toast.success("Aporte editado com sucesso!");
      return;
    }
    await addDoc(collection(db, user!.uid, String(year!), nameMonth!), docData);
    toast.success("Item cadastrado com sucesso!");

  } catch (error) {
    if (data.aporte > 0) return toast.error("Erro ao editar o aporte.");
    toast.error("Erro ao adicionar o aporte.");
  }
}
