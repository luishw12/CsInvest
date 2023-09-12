import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  month?: number;
  user: User | null;
  userDb?: DocumentData;
}

interface ModalUpdate extends ModalProps {
  data: any;
}

interface ModalViewImage extends ModalProps {
  image: string;
  name: string;
}

interface ModalView extends ModalProps {
  data: any;
}

interface ModalConfig extends ModalProps {}

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
};
