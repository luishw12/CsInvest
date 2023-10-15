"use client";
import { ModalAporte } from "../interfaces";
import ModalLayout from "../_Layout";
import {formatBrl, months} from "@/components/Calender";
import {Button, Form, Input} from "design-system-toshyro";
import {collection, doc, DocumentData, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "../../../../firebase/firebaseConfig";
import {toast} from "react-toastify";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {handleUpdateAporte} from "@/components/DbFunctions/aporte-profit";

export default function ModalAporte({
  open,
  setOpen,
  month,
  user,
  year
}: ModalAporte) {
  const [infos, setInfos] = useState<DocumentData>();
  const selectedMonth = months.find(i => i.number == month)

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user!.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setInfos({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  if (!open || !user || !selectedMonth || !year) return;

  return (
    <ModalLayout setOpen={setOpen} title={`Aporte de ${selectedMonth?.name}`}>
      <Form className="p-8 bg-white rounded-xl grid grid-cols-12 gap-5 min-w-[500px]">
        <h3 className={"col-span-12 text-center font-bold text-3xl my-4"}>{formatBrl(infos && infos.aporte && infos.aporte[year][selectedMonth.name] || 0)}</h3>
        <Input
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
              handleUpdateAporte({aporte: "250"}, "aporte", month!, year, user, infos, "add")}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$500,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "500"}, "aporte", month!, year, user, infos, "add")}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$1.000,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "1000"}, "aporte", month!, year, user, infos, "add")}
          />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            title={"Remover"}
            onSubmit={(e) =>
              handleUpdateAporte(e, "aporte", month!, year, user, infos, "remove")}
            color={"bg-red-500 hover:bg-red-600"} />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            onSubmit={(e) =>
              handleUpdateAporte(e, "aporte", month!, year, user, infos, "add")}
            title={"Adicionar"} />
        </div>
      </Form>
    </ModalLayout>
  );
}