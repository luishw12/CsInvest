"use client";
import Calender from "@/components/Calender";
import { useUser } from "@/context/UserContext";

import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

export default function Dashboard() {
  const { setYear, year } = useUser();
  return (
    <div className="h-[calc(100%-82px)] flex flex-col items-center justify-center p-10 pt-0">
      <div className="p-6 flex items-center gap-4 dark:text-gray-300">
        <button onClick={() => setYear(year - 1)}>
          <BsArrowLeftShort
            className="hover:bg-gray-300 rounded-lg dark:hover:bg-slate-600"
            size={32}
          />
        </button>
        <p className="text-2xl font-semibold">{year}</p>
        <button onClick={() => setYear(year + 1)}>
          <BsArrowRightShort
            className="hover:bg-gray-300 rounded-lg dark:hover:bg-slate-600"
            size={32}
          />
        </button>
      </div>
      <Calender />
    </div>
  );
}
