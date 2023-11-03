import { signOut } from "firebase/auth";
import { useState } from "react";

import { BiChevronDown } from "react-icons/bi";
import { PiGearSix } from "react-icons/pi";
import { HiLogout } from "react-icons/hi";

import { auth } from "../../../../firebase/firebaseConfig";
import {useUser} from "@/context/UserContext";


export default function UserMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const {setOpenConfig, user} = useUser();

  if (!user) return;

  return (
    <div className="relative h-full w-full flex items-center justify-end">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-gray-200 px-4 py-2 rounded-lg dark:hover:bg-slate-600"
      >
        <p className="font-semibold">{user.displayName}</p>
        <BiChevronDown
          size={20}
          className={`${open ? "rotate-180" : ""} duration-200`}
        />
      </button>

      <div
        className={`absolute flex flex-col duration-300 top-full overflow-hidden border-t-2 border-gray-400 dark:border-slate-300`}
      >
        <div
          className={`border-2 border-gray-400 bg-gray-100 rounded-b-xl duration-300 ease-in-out -mt-0.5 overflow-hidden dark:border-slate-300 dark:bg-slate-800 dark:text-slate-300 ${
            open ? "" : "-translate-y-full"
          }`}
        >
          <button
            onClick={() => {
              setOpenConfig(true);
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full dark:hover:bg-slate-600"
          >
            <PiGearSix size={20} />
            <p>Configurações</p>
          </button>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full dark:hover:bg-slate-600"
          >
            <HiLogout size={20} />
            <p>Sair</p>
          </button>
        </div>
      </div>
    </div>
  );
}
