"use client";
import {Button, Form} from "design-system-toshyro";
import ModalLayout from "../_Layout";
import { ModalConfig } from "../interfaces";
import {
  User,
  updateEmail,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../../../../firebase/firebaseConfig";
import {
  DocumentData,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import {useUser} from "@/context/UserContext";
import InputCs from "@/components/inputs/Input";
// @ts-ignore
import InputMaskCs from "@/components/inputs/InputMask";

export default function Configurations({ setOpen, open }: ModalConfig) {
  const [loading, setLoading] = useState<boolean>(false);

  const {user, userDb} = useUser();

  if (!open || !user || !userDb) return;

  return (
    <>
      {loading && (
        <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-25 z-50">
          <CgSpinnerTwo className="animate-spin text-blue-800" size={30} />
        </div>
      )}
      <ModalLayout title={"Configurações"} setOpen={setOpen}>
        <div className="p-5">
          <Form className="grid grid-cols-12 gap-5 min-w-[500px]">
            <InputCs
              name={"name"}
              label="Nome"
              validation={{ required: "Este campo é obrigatório" }}
              defaultValue={user.displayName!}
            />
            <InputCs
              name={"email"}
              label="Email"
              validation={{ required: "Este campo é obrigatório" }}
              defaultValue={user.email!}
            />
            <InputMaskCs
              name={"phone"}
              label="Telefone"
              mask="(99) 99999-9999"
              disabled
              width="col-span-6"
              defaultValue={user.phoneNumber!}
            />
            <div className="col-span-6 relative">
              <InputMaskCs
                name={"sellTax"}
                label="Taxa de venda"
                mask="99"
                validation={{ required: "Este campo é obrigatório" }}
                defaultValue={Math.round(userDb.sellTax * 100)}
              />
              <div className="absolute bottom-0 right-0 font-bold text-lg h-[40px] flex items-center mr-2.5 text-gray-500 dark:text-slate-800">
                %
              </div>
            </div>
            <InputCs
              name={"sheets"}
              label="Link Planilha"
              defaultValue={userDb.sheets}
            />
            <div className="col-span-12">
              <Button
                onSubmit={(e) =>
                  handleSubmit(e, user, setOpen, setLoading, userDb)
                }
                title="Salvar"
                full
              />
            </div>
          </Form>
        </div>
      </ModalLayout>
    </>
  );
}

async function handleSubmit(
  e: any,
  user: User,
  setOpen: (i: boolean) => any,
  setLoading: (i: boolean) => any,
  infos?: DocumentData
) {
  try {
    setLoading(true);
    // Atualizar o displayName, email e telefone do usuário
    await updateProfile(user, {
      displayName: e.name,
    });
    await updateEmail(user, e.email);
    if (e.phone) await updatePhoneNumber(user, e.phone);

    const docData = {
      name: e.name,
      email: e.email,
      phone: e.phone ? e.phone : user.phoneNumber,
      sellTax: Number(e.sellTax) / 100,
      emailVerified: user.emailVerified,
    };

    const docRef = doc(db, user.uid, infos!.id); // itemId é o ID exclusivo do item a ser editado
    if(e.sheets) await updateDoc(docRef, {...docData, sheets: e.sheets});
    else await updateDoc(docRef, docData);

    setOpen(false);
    setLoading(false);

    toast.success("Informações atualizadas com sucesso!");
  } catch (err: any) {
    toast.error("Falha ao editar informações: " + err.message);
    setLoading(false);
  }
}
