"use client";
import Calender from "@/components/Calender";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

export default function Dashboard() {
  const [calenderYear, setCalenderYear] = useState<number>(
    new Date().getFullYear()
  );
  const { user } = useUser();
  return (
    <div className="h-[calc(100%-82px)] flex flex-col items-center justify-center p-10 pt-0">
      <div className="p-6 flex items-center gap-4">
        <button onClick={() => setCalenderYear(calenderYear - 1)}>
          <BsArrowLeftShort
            className="hover:bg-gray-300 rounded-lg"
            size={32}
          />
        </button>
        <p className="text-2xl font-semibold">{calenderYear}</p>
        <button onClick={() => setCalenderYear(calenderYear + 1)}>
          <BsArrowRightShort
            className="hover:bg-gray-300 rounded-lg"
            size={32}
          />
        </button>
      </div>
      <Calender user={user} year={calenderYear} />
    </div>
  );
}
