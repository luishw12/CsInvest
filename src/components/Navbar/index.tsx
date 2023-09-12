"use client";
import { User } from "firebase/auth";
import { BsGraphUp } from "react-icons/bs";
import Link from "next/link";
import UserMenu from "./UserMenu";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <>
      <div className="h-[82px] px-16 flex items-center justify-between border-b-2 border-gray-400 bg-white bg-opacity-25">
        <div className="w-[200px] h-full flex items-center">
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

        <div className="w-[200px] h-full flex items-center justify-end">
          <UserMenu user={user} />
        </div>
      </div>
    </>
  );
}
