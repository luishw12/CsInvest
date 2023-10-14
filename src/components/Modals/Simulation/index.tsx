"use client";
import { Button, Form, Input } from "design-system-toshyro";
import ModalLayout from "../_Layout";
import { ModalConfig } from "../interfaces";
import { useEffect, useState } from "react";
import { formatBrl } from "@/components/Calender";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { CgSpinnerTwo } from "react-icons/cg";
import { db } from "../../../../firebase/firebaseConfig";

export default function Simulation({ setOpen, open, user }: ModalConfig) {
  const [profit, setProfit] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  const [info, setInfo] = useState<DocumentData>();

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user!.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setInfo({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  useEffect(() => {
    setProfit(0);
    setPercentage(0);
  }, [open]);

  if (!open) return;

  return (
    <>
      <ModalLayout title={"Simule seu Lucro"} setOpen={setOpen}>
        <div className="p-5">
          <Form className="grid grid-cols-12 gap-5 min-w-[500px]">
            {info ? (
              <>
                <Input
                  name={"buyPrice"}
                  label="Valor da compra"
                  width="col-span-6"
                />
                <Input
                  name={"sellPrice"}
                  label="Valor da venda"
                  width="col-span-6"
                />
                <div className="col-span-6 flex items-center justify-between font-semibold">
                  <p>Lucro em BRL:</p>
                  <p
                    className={
                      profit > 0
                        ? "text-green-500"
                        : profit < 0
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {profit != 0 ? formatBrl(profit) : "-"}
                  </p>
                </div>
                <div className="col-span-6 flex items-center justify-between font-semibold">
                  <p>Lucro em %:</p>
                  <p
                    className={
                      percentage > 0
                        ? "text-blue-500"
                        : percentage < 0
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {percentage != 0 ? percentage + "%" : "-"}
                  </p>
                </div>
                <div className="col-span-12">
                  <Button
                    title="Calcular"
                    full
                    onSubmit={(e: any) => {
                      const sellPrice = e.sellPrice.replace(",", ".");
                      const buyPrice = e.buyPrice.replace(",", ".");
                      const prof =
                        Number(sellPrice) * (1 - info.sellTax) -
                        Number(buyPrice);
                      const perc =
                        Math.round((prof / Number(buyPrice)) * 10000) / 100;
                      setProfit(prof);
                      setPercentage(perc);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="col-span-12">
                <CgSpinnerTwo
                  className="animate-spin text-blue-800"
                  size={30}
                />
              </div>
            )}
          </Form>
        </div>
      </ModalLayout>
    </>
  );
}
