"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redireciona direto para a pagina de login
  router.push("/login");

  return;
}
