"use client";
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import ModalRegister from "../Modals/Register";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import ModalView from "../Modals/View";
import { toast } from "react-toastify";
import { User } from "firebase/auth";

export const months = [
  { abrev: "Jan", name: "Janeiro", number: 1 },
  { abrev: "Fev", name: "Fevereiro", number: 2 },
  { abrev: "Mar", name: "Março", number: 3 },
  { abrev: "Abr", name: "Abril", number: 4 },
  { abrev: "Mai", name: "Maio", number: 5 },
  { abrev: "Jun", name: "Junho", number: 6 },
  { abrev: "Jul", name: "Julho", number: 7 },
  { abrev: "Ago", name: "Agosto", number: 8 },
  { abrev: "Set", name: "Setembro", number: 9 },
  { abrev: "Out", name: "Outubro", number: 10 },
  { abrev: "Nov", name: "Novembro", number: 11 },
  { abrev: "Dez", name: "Dezembro", number: 12 },
];

interface CalenderProps {
  user: User | null;
}

export default function Calender({ user }: CalenderProps) {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;

  return (
    <div className="grid grid-cols-4 w-full h-full rounded-3xl overflow-hidden border-2 gap-2 border-gray-500">
      {months.map((month, i) => {
        return (
          <MonthSection
            key={i}
            title={month.name}
            number={month.number}
            currentMonth={currentMonth}
            user={user}
          />
        );
      })}
    </div>
  );
}

interface MonthSectionProps {
  title: string;
  number: number;
  currentMonth: number;
  user: User | null;
}

function MonthSection({
  title,
  number,
  currentMonth,
  user,
}: MonthSectionProps) {
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [monthSelected, setMonthSelected] = useState<number>();

  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);

  const [infos, setInfos] = useState<any>();

  const month = months.find((m) => m.number === number);
  const year = new Date().getFullYear().toString();

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user!.uid, year, month!.name);

      onSnapshot(collectionRef, (querySnapshot) => {
        const documents: any = [];

        querySnapshot.forEach((docSnapshot) => {
          documents.push({ ...docSnapshot.data(), id: docSnapshot.id });
        });
        setInfos(documents);
      });
    }
  }, [user]);

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
      return;
    }
  }, [infos]);

  return (
    <div
      className={`border-gray-500 ${
        currentMonth === number ? "border-2 m-[-2px]" : ""
      }`}
    >
      {/* Modais */}
      <>
        <ModalRegister
          open={registerOpen}
          setOpen={setRegisterOpen}
          month={monthSelected}
          user={user}
        />

        <ModalView
          open={viewOpen}
          setOpen={setViewOpen}
          month={monthSelected}
          data={infos}
          user={user}
        />
      </>

      {/* Title */}
      <div className="flex items-center border-b text-lg justify-between px-3 py-1.5 bg-blue-300">
        <p className={`${currentMonth === number ? "font-bold" : ""}`}>
          {number}
        </p>
        <h5
          className={`${currentMonth === number ? "font-bold" : "font-normal"}`}
        >
          {title}
        </h5>
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
        {infos ? (
          <>
            <div className="w-full grid grid-cols-2">
              <p>Quantidade</p>
              <p className="text-right">{infos.length}</p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>% de Lucro</p>
              <p className="text-right">
                {investedAmount > 0
                  ? Math.round((profit / investedAmount) * 10000) / 100
                  : 0}
                %
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Valor Investido</p>
              <p className="text-right text-red-600">
                {formatBrl(investedAmount)}
              </p>
            </div>
            <div className="w-full grid grid-cols-2">
              <p className="font-semibold">Lucro Total</p>
              <p className="text-right text-green-600 font-semibold">
                {formatBrl(profit)}
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

export function formatBrl(valor: string | number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
