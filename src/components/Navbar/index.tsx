"use client";
import { signOut } from "firebase/auth";
import { BsGraphUp } from "react-icons/bs";
import { HiLogout } from "react-icons/hi";
import { auth } from "../../../firebase/firebaseConfig";

export default function Navbar() {
  return (
    <>
      <div className="py-5 px-16 flex items-center justify-between border-b-2 bg-white bg-opacity-25">
        <BsGraphUp size={20} />

        <div className="flex gap-4">
          <button className="font-medium hover:bg-gray-300 px-3 py-2 rounded-lg">
            Dashboard
          </button>
        </div>

        <button
          type="button"
          onClick={() => signOut(auth)}
          className="hover:bg-gray-300 p-2 rounded-lg"
        >
          <HiLogout size={20} />
        </button>
      </div>
    </>
  );
}
