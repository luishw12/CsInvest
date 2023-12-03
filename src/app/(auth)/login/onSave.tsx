import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs-react';
import {toast} from "react-toastify";

const prisma = new PrismaClient();

export default async function handleRegister({
                                               name,
                                               email,
                                               password,
                                               r_password,
                                             }: any) {

  // Verifica se a senha e a senha repetida são iguais
  if (password !== r_password) {
    toast.error("As senhas não coincidem");
    return;
  }

  // Verifica se o email já existe no banco de dados
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.error("O email já está registrado");
    return;
  }

  try {
    const encryptedPass = await bcrypt.hash(password, 10);
    // Cria um novo usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: encryptedPass,
        dateCreate: new Date(),
        sellTax: 0.1
      },
    });

    toast.success("Usuário criado com sucesso!");
    // Faça qualquer outra coisa que você precise após o registro bem-sucedido

  } catch (error) {
    console.error(error);
    toast.error("Erro ao criar o usuário!");
    // Trate o erro de forma adequada, como mostrar uma mensagem ao usuário
  } finally {
    await prisma.$disconnect(); // Desconecta do banco de dados quando a operação é concluída
  }
}
