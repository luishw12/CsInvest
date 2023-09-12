"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Redireciona direto para a pagina de login
  useEffect(() => {
    router.push("/login");
  });

  return;
}
