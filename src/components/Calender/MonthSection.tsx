"use client";
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import ModalRegister from "../Modals/Register";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import ModalView from "../Modals/View";
import { toast } from "react-toastify";
import { User } from "firebase/auth";
import { formatBrl, months } from ".";

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
  const [monthSelected, setMonthSelected] = useState<number>();

  const [tableOrderBy, setOrderBy] = useState<string>("buyPrice");
  const [filterName, setFilterName] = useState<string>("");

  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);

  const [infos, setInfos] = useState<any>([]);

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const percentage =
    investedAmount > 0
      ? Math.round((profit / investedAmount) * 10000) / 100
      : 0;

  const month = months.find((m) => m.number === number);

  const highlightSection = currentYear === year && currentMonth === number;

  useEffect(() => {
    if(filterName) {
      let newInfos: any = [];
      infos.forEach((info:any) => {
        if(info.name.toLowerCase().includes(filterName.toLowerCase())) newInfos.push(info);
      })
      setInfos(newInfos);
      return;
    }

    setLoading(true);
    if (user) {
      const collectionRef = collection(
        db,
        user!.uid,
        year.toString(),
        month!.name
      );

      const queryData = query(collectionRef, orderBy(tableOrderBy));

      onSnapshot(queryData, (querySnapshot) => {
        const documents: any = [];

        querySnapshot.forEach((docSnapshot) => {
          documents.push({ ...docSnapshot.data(), id: docSnapshot.id });
        });
        setInfos(documents);
      });
    }
  }, [user, year, tableOrderBy, filterName]);

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
        />

        <ModalView
          open={viewOpen}
          setOpen={setViewOpen}
          setOrderBy={setOrderBy}
          setFilter={setFilterName}
          month={monthSelected}
          data={infos}
          user={user}
          userDb={userDb}
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
            <BsEye size={18} />
          </button>
          <button
            onClick={() => {
              setRegisterOpen(true);
              setMonthSelected(number);
            }}
          >
            <AiOutlinePlusSquare size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="h-[calc(100%-41px)] flex flex-col justify-between p-4 bg-gray-200">
        {!loading ? (
          <>
            <div className="w-full grid grid-cols-2">
              <p>Quantidade</p>
              <p className="text-right">
                {infos.length === 0 ? "-" : infos.length}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>% de Lucro</p>
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
