import { AiOutlineCloseSquare } from "react-icons/ai";
import { ModalLayout } from "../interfaces";

export default function ModalLayout({ children, title, setOpen }: ModalLayout) {
  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="py-3 px-4 flex items-center justify-between">
          <p></p>
          <h2 className="text-xl font-semibold text-center col-span-12">
            {title}
          </h2>
          <AiOutlineCloseSquare
            onClick={() => setOpen(false)}
            size={22}
            className="cursor-pointer"
          />
        </div>
        {children}
      </div>
    </div>
  );
}