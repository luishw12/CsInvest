import { User, signOut } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";

import { BiChevronDown } from "react-icons/bi";
import { VscGraph } from "react-icons/vsc";
import { PiGearSix } from "react-icons/pi";
import { HiLogout } from "react-icons/hi";

import { auth } from "../../../../firebase/firebaseConfig";

interface UserMenuProps {
  user: User | null;
  setOpenConfig: Dispatch<SetStateAction<boolean>>;
  setOpenSimulation: Dispatch<SetStateAction<boolean>>;
}

export default function UserMenu({
  user,
  setOpenConfig,
  setOpenSimulation,
}: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

  if (!user) return;

  return (
    <div className="relative h-full w-full flex items-center justify-end">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-gray-200 px-4 py-2 rounded-lg"
      >
        <p className="font-semibold">{user.displayName}</p>
        <BiChevronDown
          size={20}
          className={`${open ? "rotate-180" : ""} duration-200`}
        />
      </button>

      <div
        className={`absolute flex flex-col duration-300 top-full overflow-hidden border-t-2 border-gray-400`}
      >
        <div
          className={`border-2 border-gray-400 bg-gray-100 rounded-b-xl duration-300 ease-in-out -mt-0.5 overflow-hidden ${
            open ? "" : "-translate-y-full"
          }`}
        >
          <button
            onClick={() => {
              setOpenSimulation(true);
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full"
          >
            <VscGraph size={20} />
            <p>Simulador</p>
          </button>
          <button
            onClick={() => {
              setOpenConfig(true);
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full"
          >
            <PiGearSix size={20} />
            <p>Configurações</p>
          </button>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 w-full"
          >
            <HiLogout size={20} />
            <p>Sair</p>
          </button>
        </div>
      </div>
    </div>
  );
}
