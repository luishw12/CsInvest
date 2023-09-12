"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

export interface LayoutProps {
  children: JSX.Element;
}

export default function LoginLayout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("dashboard");
    });
  }, [router]);

  return (
    <div className="bg-gradient-to-tl from-purple-500 to-blue-500 flex items-center justify-center h-full">
      <div className="p-8 border-2 rounded-3xl bg-white bg-opacity-25">
        {children}
      </div>
    </div>
  );
}
