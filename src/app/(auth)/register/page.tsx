"use client";
import { Button, Form, Input, InputPass } from "design-system-toshyro";
import Link from "next/link";
import registerUser from "../../../../firebase/authentication/registerUser";

export default function Register() {
  return (
    <Form className="flex flex-col items-center gap-10">
      <h1 className="text-white font-semibold text-3xl">Criar Conta</h1>
      <div className="grid grid-cols-12 w-[350px] gap-5">
        <Input name={"name"} placeholder="Nome" />
        <Input name={"email"} placeholder="E-mail" />
        <InputPass name={"password"} placeholder="Sua Senha" />
        <Input
          name={"r_password"}
          type="password"
          placeholder="Repetir senha"
        />
        <div className="col-span-12 w-full flex flex-col gap-3 mt-5">
          <Button
            onSubmit={handleRegister}
            title="Criar Conta"
            type="button"
            full
          />
          <Link
            href={"/login"}
            className="text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Entrar
          </Link>
        </div>
      </div>
    </Form>
  );
}

function handleRegister(e: any) {
  registerUser(e.name, e.email, e.password, e.r_password);
}
