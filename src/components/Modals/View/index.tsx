"use client";
import { Table, TableObjectDto, Td, Th } from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";

import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";

import { useState } from "react";
import ModalUpdate from "../Update";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { ModalView } from "../interfaces";
import ModalViewImage from "../ItemImage";
import ModalLayout from "../_Layout";

const columns: TableObjectDto[] = [
  { name: "Nome" },
  { name: "Valor Compra", align: "right" },
  { name: "Valor Venda", align: "right" },
  { name: "Destaques", align: "center" },
  { name: "Lucro BRL", align: "right" },
  { name: "Lucro %", align: "center" },
  { name: "", align: "right" },
];

export default function ModalView({
  open,
  setOpen,
  month,
  data,
  user,
}: ModalView) {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewImageOpen, setViewImageOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState();

  const [itemImage, setItemImage] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");

  if (!open || !data) return;

  if (editOpen)
    return (
      <ModalUpdate
        open={editOpen}
        setOpen={setEditOpen}
        month={month}
        data={dataUpdate}
        user={user}
      />
    );

  if (viewImageOpen)
    return (
      <ModalViewImage
        open={viewImageOpen}
        setOpen={setViewImageOpen}
        image={itemImage}
        name={itemName}
        user={user}
      />
    );

  const nameMonth = months.find((m) => m.number === month)?.name;
  const year = new Date().getFullYear().toString();

  return (
    <ModalLayout title={`Seus Itens de ${nameMonth}`} setOpen={setOpen}>
      <Table columns={columns} pagination={data.length > 10}>
        {data.map((item: any, key: number) => {
          async function editHightlights(type: "add" | "remove") {
            if (type === "remove" && item.highlights == 0) {
              toast.error(
                "Você não pode ter menos que R$0,00 de valor em destaque"
              );
              return;
            }

            const highlights =
              type === "add" ? item.highlights + 2 : item.highlights - 2;

            const realProfit =
              type === "add" ? item.realProfit - 2 : item.realProfit + 2;
            const percentage =
              Math.round((realProfit / (item.buyPrice + highlights)) * 10000) /
              100;

            const newData = { ...item };
            delete newData.id;

            const docData = {
              ...newData,
              highlights: highlights,
              realProfit: realProfit,
              percentage: percentage,
            };

            const docRef = doc(db, user!.uid, year, nameMonth!, item.id); // itemId é o ID exclusivo do item a ser editado
            await updateDoc(docRef, docData);
          }

          return (
            <tr key={key}>
              <Th>
                <button
                  onClick={() => {
                    setEditOpen(true);
                    setDataUpdate(item);
                    setOpen(false);
                  }}
                >
                  {item.name}
                </button>
              </Th>
              <Td align="right">{formatBrl(item.buyPrice)}</Td>
              <Td align="right">{formatBrl(item.sellPrice)}</Td>
              <Td align="center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editHightlights("remove")}
                    className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-md text-white"
                  >
                    -
                  </button>
                  <p>{formatBrl(item.highlights)}</p>
                  <button
                    type="button"
                    onClick={() => editHightlights("add")}
                    className="w-5 h-5 bg-green-600 flex items-center justify-center rounded-md text-white"
                  >
                    +
                  </button>
                </div>
              </Td>
              <Td align="right">{formatBrl(item.realProfit)}</Td>
              <Td align="center">{item.percentage}%</Td>
              <Td align="right">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setItemImage(item.image);
                      setItemName(item.name);
                      setViewImageOpen(true);
                    }}
                    className="p-1.5 bg-gray-400 hover:bg-gray-500 rounded-md text-white"
                  >
                    <AiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(nameMonth, item.id, user);
                      if (data.length == 1) setOpen(false);
                    }}
                    className="p-1.5 bg-red-400 hover:bg-red-500 rounded-md text-white"
                  >
                    <BiTrashAlt size={16} />
                  </button>
                </div>
              </Td>
            </tr>
          );
        })}
      </Table>
    </ModalLayout>
  );
}

async function handleDelete(month: any, id: string, user: any) {
  const year = new Date().getFullYear().toString();

  if (confirm("Tem certeza que deseja deletar este item?"))
    try {
      const docRef = doc(db, user!.uid, year, month!, id);
      await deleteDoc(docRef);
      toast.success("Item excluido com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao excluir o item: ", err);
    }
}
