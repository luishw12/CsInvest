"use client";
import { Button, Form, Input, InputPass } from "design-system-toshyro";
import Link from "next/link";
import loginUser from "../../../../firebase/authentication/loginUser";

export default function Login() {
  return (
    <Form className="flex flex-col items-center gap-10">
      <h1 className="text-white font-semibold text-3xl">Login</h1>
      <div className="grid grid-cols-12 w-[350px] gap-5">
        <Input name={"login"} placeholder="Login" />
        <InputPass name={"password"} placeholder="Senha" />
        <div className="col-span-12 w-full flex flex-col gap-3 mt-5">
          <Button onSubmit={handleLogin} title="Entrar" type="button" full />
          <Link
            href={"/register"}
            className="text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </Form>
  );
}

function handleLogin(e: any) {
  loginUser(e.login, e.password);
}
