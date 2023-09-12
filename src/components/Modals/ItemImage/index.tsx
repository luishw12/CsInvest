"use client";
import Image from "next/image";

import { ModalViewImage } from "../interfaces";
import ModalLayout from "../_Layout";

export default function ModalViewImage({
  open,
  setOpen,
  image,
  name,
}: ModalViewImage) {
  if (!open) return;

  return (
    <ModalLayout setOpen={setOpen} title={name}>
      <div className="flex justify-center px-14 py-3">
        <Image
          src={image}
          alt={"Imagem de: " + name}
          width={400}
          height={400}
        />
      </div>
    </ModalLayout>
  );
}
