"use client";
import React, { useEffect, useState } from "react";
import {AiOutlineDollarCircle, AiOutlineEye, AiOutlinePlusCircle} from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import {
  collection,
  onSnapshot,
  query, addDoc, doc, deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { formatBrl, months } from ".";
import {handleUpdateAporte} from "@/components/DbFunctions/aporte-profit";
import {useUser} from "@/context/UserContext";

interface MonthSectionProps {
  title: string;
  number: number;
}

export default function MonthSection({
  title,
  number,
}: MonthSectionProps) {
  const {
    year,
    user,
    setMonthSelected,
    setAporteOpen,
    setViewOpen,
    setRegisterOpen,
    userDb,
  } = useUser();
  const [loading, setLoading] = useState<boolean>(true);

  const [monthInfos, setMonthInfos] = useState<any>();

  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [totalAporteProfit, setTotalAporteProfit] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const percentage =
    totalAporteProfit > 0
      ? Math.round((profit / totalAporteProfit) * 10000) / 100
      : 0;

  const month = months.find((m) => m.number === number);

  const highlightSection = currentYear === year && currentMonth === number;

  useEffect(() => {
    setLoading(true);
    if (user) {
      const collectionRef = collection(
        db,
        user!.uid,
        year.toString(),
        month!.name
      );

      const queryData = query(collectionRef);

      const itemsMovedToCurrentMonth = new Set(); // Conjunto para rastrear itens movidos

      onSnapshot(queryData, (querySnapshot) => {
        const documents: any = [];
        let incomming = 0;
        let qntIncomming = 0;

        querySnapshot.forEach((docSnapshot) => {
          const nameMonth = months.find((m) => m.number === currentMonth)?.name;

          documents.push({ ...docSnapshot.data(), id: docSnapshot.id });

          if(docSnapshot.data().sold) {
            const porcentage = docSnapshot.data().percentage
            incomming += porcentage;
            qntIncomming += 1;
          }

          if(number != currentMonth) {
            if(!docSnapshot.data().sold && !itemsMovedToCurrentMonth.has(docSnapshot.id)) {
              addDoc(collection(db, user!.uid, year.toString(), nameMonth!), {...docSnapshot.data()});
              const document = doc(db, user!.uid, year.toString(), month!.name!, docSnapshot.id);
              deleteDoc(document);
              itemsMovedToCurrentMonth.add(docSnapshot.id); // Marcar o item como movido
            }
          }
        })

        setIncome(qntIncomming === 0 ? 0 : Math.round(incomming/qntIncomming * 100) / 100);
        setMonthInfos(documents);
      });
    }
  }, [year, user]);

  useEffect(() => {
    if(userDb && (userDb.aporte || userDb.profit)) {
      let continueSum = true;

      let totalAporteProf = 0;

      let yearAporte = year;
      let monthAporte = currentMonth;

      while (continueSum) {
        const currentAporteMonth = months.find(i => i.number == monthAporte)!.name
        if (userDb["aporte" || "profit"][yearAporte][currentAporteMonth]) {
          monthAporte -= 1;
          if (monthAporte == 1) {
            monthAporte = 12;
            yearAporte -= 1;
          }
          if (monthAporte === currentMonth) {
            totalAporteProf += userDb.aporte[yearAporte][currentAporteMonth] + userDb.profit[yearAporte][currentAporteMonth];
            return
          }
          totalAporteProf += userDb.aporte[yearAporte][currentAporteMonth];
        } else {
          continueSum = false;
        }
      }
      setTotalAporteProfit(totalAporteProf);
    }
  }, [userDb]);

  useEffect(() => {
    setInvestedAmount(0);
    setProfit(0);
    let invested = 0;
    let prof = 0;
    if (monthInfos) {
      monthInfos.map((info: any) => {
        if(!info.sold) {
          invested += info.buyPrice + info.highlights;
          setInvestedAmount(invested);
        }
        if(info.sold){
          prof += info.realProfit;
          setProfit(prof);
        }
      });
      setLoading(false);
      return;
    }
  }, [monthInfos]);

  if(user && profit > 0) handleUpdateAporte({profit: profit}, "profit", number, year, user, userDb);

  return (
    <div
      className={`rounded-xl overflow-hidden border-2 shadow-md ${
        highlightSection ? "border-blue-700" : "border-gray-700 dark:border-slate-600"
      }`}
    >
      {/* Title */}
      <div
        className={`flex items-center text-lg justify-between px-3 py-1.5  text-white ${
          highlightSection ? "font-bold bg-blue-700" : "font-normal bg-gray-700 dark:bg-slate-600"
        }`}
      >
        <p>{number}</p>
        <h5>{title}</h5>
        <div className="flex gap-2">
          <button
              className={"hover:text-green-400 duration-100"}
              onClick={() => {
                setAporteOpen(true);
                setMonthSelected(number);
              }}
          >
            <AiOutlineDollarCircle size={20} />
          </button>
          <button
            className={"hover:text-orange-400 duration-100"}
            onClick={() => {
              if (!monthInfos) return;
              if (monthInfos.length === 0)
                return toast.info(
                  `Você ainda não possui items cadastrados em ${month?.name}`
                );
              setViewOpen(true);
              setMonthSelected(number);
            }}
          >
            <AiOutlineEye size={20} />
          </button>
          <button
            className={`${highlightSection ? "hover:text-blue-300" : "hover:text-blue-400"} duration-100`}
            onClick={() => {
              setRegisterOpen(true);
              setMonthSelected(number);
            }}
          >
            <AiOutlinePlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="h-[calc(100%-41px)] flex flex-col justify-between p-4 bg-gray-200 dark:bg-slate-800 dark:text-slate-300">
        {!loading ? (
          <>
            <div className="w-full grid grid-cols-2">
              <p>Rendimento Médio</p>
              <p
                className={`text-right ${
                  investedAmount || profit ? "text-blue-600 dark:text-sky-300" : "text-black dark:text-slate-300"
                }`}
              >
                {investedAmount || profit ? `${income}%` : "-"}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Rentabilidade</p>
              <p
                className={`text-right ${
                  investedAmount || profit ? "text-blue-600 dark:text-sky-300" : "text-black dark:text-slate-300"
                }`}
              >
                {investedAmount || profit ? `${percentage}%` : "-"}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Valor Inventário</p>
              <p
                className={`text-right ${
                  investedAmount === 0 ? "text-black dark:text-slate-300" : "text-red-600"
                }`}
              >
                {investedAmount === 0 ? "-" : formatBrl(investedAmount)}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p className="font-semibold">Lucro Total</p>
              <p
                className={`text-right font-semibold ${
                  profit > 0
                    ? "text-green-600"
                    : profit === 0
                    ? "text-black dark:text-slate-300"
                    : "text-red-600"
                }`}
              >
                {profit === 0 ? "-" : formatBrl(profit)}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex justify-center items-center">
            <CgSpinnerTwo className="animate-spin" size={28} />
          </div>
        )}
      </div>
    </div>
  );
}
