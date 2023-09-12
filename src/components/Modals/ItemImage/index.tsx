"use client";
import Image from "next/image";
import { ModalProps } from "../Register";

import { AiOutlineCloseSquare } from "react-icons/ai";

interface ModalView extends ModalProps {
  image: string;
  name: string;
}

export default function ModalViewImage({
  open,
  setOpen,
  image,
  name,
}: ModalView) {
  if (!open) return;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="py-3 px-4 flex items-center justify-between">
          <p></p>
          <h2 className="text-xl font-semibold text-center col-span-12">
            {name}
          </h2>
          <AiOutlineCloseSquare
            onClick={() => setOpen(false)}
            size={22}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-center px-14 py-3">
          <Image
            src={image}
            alt={"Imagem de: " + name}
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
