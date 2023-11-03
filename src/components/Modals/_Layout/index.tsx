import {AiOutlineCloseCircle} from "react-icons/ai";
import { ModalLayout } from "../interfaces";
import {ClickAwayListener} from "@mui/base";

export default function ModalLayout({ children, title, qntItens, setOpen, width }: ModalLayout) {
  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
      <ClickAwayListener onClickAway={()=> setOpen(false)}>
        <div className={`bg-white rounded-xl overflow-hidden dark:bg-slate-800 dark:text-slate-300 ${width}`}>
          <div className="py-3 px-4 flex items-center justify-between">
            <p className={"text-lg font-medium tracking-wide"}>{qntItens ? `Qnt(${qntItens})` : ""}</p>
            <h2 className="text-xl font-semibold text-center col-span-12">
              {title}
            </h2>
            <AiOutlineCloseCircle
              onClick={() => setOpen(false)}
              size={22}
              className="cursor-pointer hover:text-red-500 duration-150"
            />
          </div>
          {children}
        </div>
      </ClickAwayListener>
    </div>
  );
}