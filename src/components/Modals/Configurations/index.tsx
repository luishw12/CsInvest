"use client";
import { Button, Form, Input, InputMask } from "design-system-toshyro";
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
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";

export default function Configurations({ user, setOpen, open }: ModalConfig) {
  const [loading, setLoading] = useState<boolean>(false);

  const [infos, setInfos] = useState<DocumentData>();

  useEffect(() => {
    setLoading(true);
    if (user) {
      const collectionRef = collection(db, user!.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setInfos({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
      setLoading(false);
    }
  }, [user]);

  if (!open || !user) return;

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
            <Input
              name={"name"}
              label="Nome"
              validation={{ required: "Este campo é obrigatório" }}
              defaultValue={user.displayName!}
            />
            <Input
              name={"email"}
              label="Email"
              validation={{ required: "Este campo é obrigatório" }}
              defaultValue={user.email!}
            />
            <InputMask
              name={"phone"}
              label="Telefone"
              type="cel"
              width="col-span-6"
              defaultValue={user.phoneNumber!}
            />
            <div className="col-span-6 relative">
              {infos ? (
                <InputMask
                  name={"sellTax"}
                  label="Taxa de venda"
                  mask="99"
                  validation={{ required: "Este campo é obrigatório" }}
                  defaultValue={infos.sellTax * 100}
                />
              ) : (
                <InputMask mask="99" name={"sellTax"} label="Taxa de venda" />
              )}
              <div className="absolute bottom-0 right-0 font-semibold text-lg h-[40px] flex items-center mr-2.5 text-gray-500">
                %
              </div>
            </div>
            <div className="col-span-12">
              <Button
                onSubmit={(e) =>
                  handleSubmit(e, user, setOpen, setLoading, infos)
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
    await updateDoc(docRef, docData);

    setOpen(false);
    setLoading(false);

    toast.success("Informações atualizadas com sucesso!");
  } catch (err: any) {
    toast.error("Falha ao editar informações: " + err.message);
  }
}
