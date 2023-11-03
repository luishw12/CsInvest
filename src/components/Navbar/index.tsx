"use client";
import Link from "next/link";
import UserMenu from "./UserMenu";
import {LuCalculator} from "react-icons/lu";
import {SiGooglesheets} from "react-icons/si";
import {SlCalculator} from "react-icons/sl";
import {useUser} from "@/context/UserContext";
import {BiSolidMoon, BiSun} from "react-icons/bi";

export default function Navbar() {

  const {setOpenSimulation, userDb, theme, setTheme} = useUser();

  return (
    <>
      <div className="h-[82px] px-16 flex items-center justify-between border-b-2 border-gray-400 bg-white bg-opacity-25 dark:bg-slate-900 dark:bg-opacity-25 dark:text-slate-300 dark:border-slate-300">
        <div className="w-[300px] h-full flex items-center">
          {theme === "dark" && <BiSolidMoon size={26} className={"cursor-pointer"} onClick={()=> setTheme("light")} />}
          {theme === "light" && <BiSun size={26} className={"cursor-pointer"} onClick={()=> setTheme("dark")} />}
        </div>

        <div className="flex gap-4">
          <Link
            href={"/dashboard"}
            className="font-medium hover:bg-gray-300 px-3 py-2 rounded-lg dark:hover:bg-slate-600"
          >
            Dashboard
          </Link>
        </div>

        <div className="w-[300px] h-full flex items-center justify-end">
          <div>
            <button
              onClick={() => setOpenSimulation(true)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full rounded-md dark:hover:bg-slate-600"
            >
              <LuCalculator size={20} />
            </button>
          </div>
          <div>
            {userDb?.sheets && (
              <Link
                href={userDb.sheets}
                target="_blank"
                className="flex items-center gap-3 text-green-700 px-4 py-3 hover:bg-gray-200 w-full rounded-md dark:hover:bg-slate-600"
              >
                <SiGooglesheets size={20} />
              </Link>
            )}
          </div>
          <div>
            <Link
              href={"https://www.mobills.com.br/calculadoras/calculadora-juros-compostos/"}
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full rounded-md dark:hover:bg-slate-600"
            >
              <SlCalculator size={20}/>
            </Link>
          </div>
          <UserMenu />
        </div>
      </div>
    </>
  );
}
