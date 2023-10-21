"use client";
import Navbar from "@/components/Navbar";
import { LayoutProps } from "../(auth)/layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useUser } from "@/context/UserContext";

export default function LayoutPages({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("login");
    });
  }, [router]);

  return (
    <>
      <div className="h-full bg-gray-100">
        <Navbar />
        {children}
      </div>
    </>
  );
}
