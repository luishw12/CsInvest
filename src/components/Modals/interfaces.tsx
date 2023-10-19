import { User } from "firebase/auth";
import {DocumentData, OrderByDirection} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  month?: number;
  user: User | null;
  userDb?: DocumentData;
}

interface ModalUpdate extends ModalProps {
  setViewOpen: Dispatch<SetStateAction<boolean>>,
  data: any;
  year: number
}

interface ModalRegister extends ModalProps {
  year: number
}

interface ModalViewImage extends ModalProps {
  image: string;
  name: string;
}

interface ModalView extends ModalProps {
  setOrderBy: Dispatch<SetStateAction<{ field: string, direction: OrderByDirection }>>;
  data: any;
  year: number
}

interface ModalConfig extends ModalProps {}

interface ModalAporte extends ModalProps {
  data: any;
  year: number
}

interface ModalLayout {
  children: JSX.Element;
  title: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type {
  ModalViewImage,
  ModalView,
  ModalUpdate,
  ModalProps,
  ModalConfig,
  ModalLayout,
  ModalAporte,
  ModalRegister
};
