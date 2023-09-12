"use client";
import { User } from "firebase/auth";
import MonthSection from "./MonthSection";

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
  year: number;
}

export default function Calender({ user, year }: CalenderProps) {
  return (
    <div className="grid grid-cols-4 w-full h-full overflow-hidden gap-5">
      {months.map((month, i) => {
        return (
          <MonthSection
            key={i}
            title={month.name}
            number={month.number}
            user={user}
            year={year}
          />
        );
      })}
    </div>
  );
}

export function formatBrl(valor: string | number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
