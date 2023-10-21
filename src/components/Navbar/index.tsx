"use client";
import { User } from "firebase/auth";
import { BsGraphUp } from "react-icons/bs";
import Link from "next/link";
import UserMenu from "./UserMenu";
import Configurations from "../Modals/Configurations";
import {useEffect, useState} from "react";
import {LuCalculator} from "react-icons/lu";
import {SiGooglesheets} from "react-icons/si";
import {SlCalculator} from "react-icons/sl";
import {collection, DocumentData, onSnapshot} from "firebase/firestore";
import {db} from "../../../firebase/firebaseConfig";
import {useUser} from "@/context/UserContext";

export default function Navbar() {

  const {setOpenSimulation, userDb} = useUser();

  return (
    <>
      <div className="h-[82px] px-16 flex items-center justify-between border-b-2 border-gray-400 bg-white bg-opacity-25">
        <div className="w-[250px] h-full flex items-center">
          <BsGraphUp size={20} />
        </div>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="font-medium hover:bg-gray-300 px-3 py-2 rounded-lg"
          >
            Dashboard
          </Link>
        </div>

        <div className="w-[250px] h-full flex items-center justify-end">
          <div>
            <button
              onClick={() => setOpenSimulation(true)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full rounded-md"
            >
              <LuCalculator size={20} />
            </button>
          </div>
          <div>
            {userDb?.sheets && (
              <Link
                href={userDb.sheets}
                target="_blank"
                className="flex items-center gap-3 text-green-700 px-4 py-3 hover:bg-gray-200 w-full rounded-md"
              >
                <SiGooglesheets size={20} />
              </Link>
            )}
          </div>
          <div>
            <Link
              href={"https://www.mobills.com.br/calculadoras/calculadora-juros-compostos/"}
              target="_blank"
              className="flex items-center gap-3 text-green-700 px-4 py-3 hover:bg-gray-200 w-full rounded-md"
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
