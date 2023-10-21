"use client";
import Image from "next/image";

import { ModalViewImage } from "../interfaces";
import ModalLayout from "../_Layout";
import {useUser} from "@/context/UserContext";

export default function ModalViewImage({
  open,
  setOpen,
}: ModalViewImage) {
  const {dataItem} = useUser();

  if (!open) return;

  return (
    <ModalLayout setOpen={setOpen} title={dataItem.name}>
      <div className="flex justify-center px-14 py-3">
        <Image
          src={dataItem.image}
          alt={"Imagem de: " + dataItem.name}
          width={400}
          height={400}
        />
      </div>
    </ModalLayout>
  );
}
