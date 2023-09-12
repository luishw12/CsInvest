import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserContextProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cs Invest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <UserContextProvider>
        <body className={`${inter.className} h-screen`}>
          {children}
          <ToastContainer />
        </body>
      </UserContextProvider>
    </html>
  );
}
