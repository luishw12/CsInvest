"use client";
import { User } from "firebase/auth";
import { BsGraphUp } from "react-icons/bs";
import Link from "next/link";
import UserMenu from "./UserMenu";
import Configurations from "../Modals/Configurations";
import {useEffect, useState} from "react";
import Simulation from "../Modals/Simulation";
import {LuCalculator} from "react-icons/lu";
import {SiGooglesheets} from "react-icons/si";
import {collection, DocumentData, onSnapshot} from "firebase/firestore";
import {db} from "../../../firebase/firebaseConfig";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const [openSimulation, setOpenSimulation] = useState<boolean>(false);

  const [infos, setInfos] = useState<DocumentData>();

  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, user!.uid);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          setInfos({ ...docSnapshot.data(), id: docSnapshot.id });
        });
      });
    }
  }, [user]);

  return (
    <>
      <Configurations user={user} open={openConfig} setOpen={setOpenConfig} />
      <Simulation
        user={user}
        open={openSimulation}
        setOpen={setOpenSimulation}
      />
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
            <Link
              href={infos?.sheets || ""}
              target="_blank"
              className="flex items-center gap-3 text-green-700 px-4 py-3 hover:bg-gray-200 w-full rounded-md"
            >
              <SiGooglesheets size={20} />
            </Link>
          </div>
          <UserMenu
            user={user}
            setOpenConfig={setOpenConfig}
            setOpenSimulation={setOpenSimulation}
          />
        </div>
      </div>
    </>
  );
}
