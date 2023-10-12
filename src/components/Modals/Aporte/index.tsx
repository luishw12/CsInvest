"use client";
import { ModalAporte } from "../interfaces";
import ModalLayout from "../_Layout";
import {formatBrl, months} from "@/components/Calender";
import {Button, Form, Input} from "design-system-toshyro";
import {addDoc, collection, doc, DocumentData, getDoc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../../firebase/firebaseConfig";
import {toast} from "react-toastify";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";

export default function ModalAporte({
  open,
  setOpen,
  month,
  user,
  year
}: ModalAporte) {
  const selectedMonth = months.find(i => i.number == month)

  if (!open || !user || !selectedMonth || !year) return;

  const [infos, setInfos] = useState<DocumentData>();

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
              handleUpdateAporte({aporte: "250"}, "add", month!, year, user, infos)}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$500,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "500"}, "add", month!, year, user, infos)}
          />
        </div>
        <div className={"col-span-4"}>
          <Button
            full
            type="button"
            title={"+R$1.000,00"}
            variant="cancel"
            onClick={() =>
              handleUpdateAporte({aporte: "1000"}, "add", month!, year, user, infos)}
          />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            title={"Remover"}
            onSubmit={(e) =>
              handleUpdateAporte(e, "remove", month!, year, user, infos)}
            color={"bg-red-500 hover:bg-red-600"} />
        </div>
        <div className={"col-span-6"}>
          <Button
            full
            type="button"
            onSubmit={(e) =>
              handleUpdateAporte(e, "add", month!, year, user, infos)}
            title={"Adicionar"} />
        </div>
      </Form>
    </ModalLayout>
  );
}

async function handleUpdateAporte(
    e: any,
    type: "add" | "remove",
    month: number,
    year: number,
    user: User,
    infos?: DocumentData
) {
  const nameMonth = months.find((i) => i.number === month)?.name;
  if (!nameMonth || !infos) return;

  console.log(e.aporte);

  try {
    // Obter uma referência ao documento do usuário
    const userDocRef = doc(db, user.uid, infos.id);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();

      // Verificar se o campo 'aporte' existe
      if (!userData.aporte) {
        userData.aporte = {};
      }

      // Verificar se o 'year' existe
      if (!userData.aporte[year]) {
        userData.aporte[year] = {};
      }

      // Verificar se 'nameMonth' existe
      if (!userData.aporte[year][nameMonth]) {
        userData.aporte[year][nameMonth] = 0;
      }

      // Atualizar o valor de 'nameMonth' com base em 'type'
      switch (type) {
        case "add":
          userData.aporte[year][nameMonth] = userData.aporte[year][nameMonth] + Number(e.aporte);
          break;
        case "remove":
          userData.aporte[year][nameMonth] = userData.aporte[year][nameMonth] - Number(e.aporte);
          break;
      }

      // Atualizar o documento no Firestore
      await setDoc(userDocRef, userData, { merge: true });
      toast.success('Aporte atualizado com sucesso.', {autoClose: 1000});
    } else {
      toast.error('Documento do usuário não encontrado.');
    }
  } catch (error:any) {
    toast.error('Erro ao atualizar aporte:', error);
  }
}