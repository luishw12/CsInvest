"use client";
import React, { useEffect, useState } from "react";
import {AiOutlineDollarCircle, AiOutlineEye, AiOutlinePlusCircle} from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import ModalRegister from "../Modals/Register";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query, addDoc, doc, deleteDoc, OrderByDirection,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import ModalView from "../Modals/View";
import { toast } from "react-toastify";
import { User } from "firebase/auth";
import { formatBrl, months } from ".";
import ModalAporte from "@/components/Modals/Aporte";
import {handleUpdateAporte} from "@/components/DbFunctions/aporte-profit";

interface MonthSectionProps {
  title: string;
  number: number;
  user: User | null;
  userDb?: DocumentData;
  year: number;
}

export default function MonthSection({
  title,
  number,
  user,
  userDb,
  year,
}: MonthSectionProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [aporteOpen, setAporteOpen] = useState<boolean>(false);

  const [monthSelected, setMonthSelected] = useState<number>();

  const [tableOrderBy, setOrderBy] =
    useState<{ field: string, direction: OrderByDirection }>({field: "date", direction: "desc"});

  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [totalAporteProfit, setTotalAporteProfit] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const [infos, setInfos] = useState<any>([]);
  const [userInfos, setUserInfos] = useState<any>([]);

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

      const queryData = query(collectionRef, orderBy(tableOrderBy.field, tableOrderBy.direction));

      onSnapshot(queryData, (querySnapshot) => {
        const documents: any = [];
        let incomming = 0;
        let qntIncomming = 0;

        querySnapshot.forEach((docSnapshot) => {
          const nameMonth = months.find((m) => m.number === currentMonth)?.name;

          documents.push({ ...docSnapshot.data(), id: docSnapshot.id });

          if(docSnapshot.data().sellPrice > 0) {
            const porcentage = docSnapshot.data().percentage
            incomming += porcentage;
            qntIncomming += 1;
          }

          if(number != currentMonth) {
            if(docSnapshot.data().sellPrice <= 0) {
              addDoc(collection(db, user!.uid, year.toString(), nameMonth!), {...docSnapshot.data()});
              const document = doc(db, user!.uid, year.toString(), month!.name!, docSnapshot.id)
              deleteDoc(document);
            }
          }
        })

        setIncome(qntIncomming === 0 ? 0 : Math.round(incomming/qntIncomming * 100) / 100);
        setInfos(documents);
      });
    }
  }, [user, year, tableOrderBy]);

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user!.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setUserInfos({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if(userInfos.aporte || userInfos.profit) {
      let continueSum = true;

      let totalAporteProf = 0;

      let yearAporte = year;
      let monthAporte = currentMonth;

      while (continueSum) {
        const currentAporteMonth = months.find(i => i.number == monthAporte)!.name
        if (userInfos["aporte" || "profit"][yearAporte][currentAporteMonth]) {
          monthAporte -= 1;
          if (monthAporte == 1) {
            monthAporte = 12;
            yearAporte -= 1;
          }
          if (monthAporte === currentMonth) {
            totalAporteProf += userInfos.aporte[yearAporte][currentAporteMonth] + userInfos.profit[yearAporte][currentAporteMonth];
            return
          }
          totalAporteProf += userInfos.aporte[yearAporte][currentAporteMonth];
        } else {
          continueSum = false;
        }
      }
      setTotalAporteProfit(totalAporteProf);
    }
  }, [userInfos]);

  useEffect(() => {
    setInvestedAmount(0);
    setProfit(0);
    let invested = 0;
    let prof = 0;
    if (infos) {
      infos.map((info: any) => {
        invested += info.buyPrice + info.highlights;
        setInvestedAmount(invested);
        prof += info.realProfit;
        setProfit(prof);
      });
      setLoading(false);
      return;
    }
  }, [infos]);

  if(user && profit > 0) handleUpdateAporte({profit: profit}, "profit", number, year, user, userInfos);

  return (
    <div
      className={`rounded-xl overflow-hidden border-2  ${
        highlightSection ? "border-blue-700" : "border-gray-700"
      }`}
    >
      {/* Modais */}
      <>
        <ModalRegister
          open={registerOpen}
          setOpen={setRegisterOpen}
          month={monthSelected}
          user={user}
          userDb={userDb}
          year={year}
        />

        <ModalAporte
          open={aporteOpen}
          setOpen={setAporteOpen}
          month={monthSelected}
          data={infos}
          user={user}
          year={year}
        />

        <ModalView
          open={viewOpen}
          setOpen={setViewOpen}
          setOrderBy={setOrderBy}
          month={monthSelected}
          data={infos}
          user={user}
          userDb={userDb}
          year={year}
        />
      </>

      {/* Title */}
      <div
        className={`flex items-center text-lg justify-between px-3 py-1.5  text-white ${
          highlightSection ? "font-bold bg-blue-700" : "font-normal bg-gray-700"
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
              if (!infos) return;
              if (infos.length === 0)
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
      <div className="h-[calc(100%-41px)] flex flex-col justify-between p-4 bg-gray-200">
        {!loading ? (
          <>
            <div className="w-full grid grid-cols-2">
              <p>Rendimento Médio</p>
              <p
                className={`text-right ${
                  investedAmount ? "text-blue-600" : "text-black"
                }`}
              >
                {investedAmount ? `${income}%` : "-"}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Rentabilidade</p>
              <p
                className={`text-right ${
                  investedAmount ? "text-blue-600" : "text-black"
                }`}
              >
                {investedAmount ? `${percentage}%` : "-"}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Valor Investido</p>
              <p
                className={`text-right ${
                  investedAmount === 0 ? "text-black" : "text-red-600"
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
                    ? "text-black"
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
