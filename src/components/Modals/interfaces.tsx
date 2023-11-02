import { Dispatch, SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface ModalUpdate extends ModalProps {}

interface ModalRegister extends ModalProps {}

interface ModalViewImage extends ModalProps {}

interface ModalView extends ModalProps {}

interface ModalConfig extends ModalProps {}

interface ModalAporte extends ModalProps {}

interface ModalLayout {
  children: JSX.Element;
  title: string;
  qntItens?: number;
  width?: string;
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
