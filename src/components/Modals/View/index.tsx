"use client";
import { Table, TableObjectDto, Td, Th } from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";
import { ModalProps } from "../Register";

import { AiOutlineCloseSquare } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";

import { useState } from "react";
import ModalUpdate from "../Update";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { toast } from "react-toastify";

interface ModalView extends ModalProps {
  data: any;
}

const columns: TableObjectDto[] = [
  { name: "Nome" },
  { name: "Valor Compra", align: "right" },
  { name: "Valor Venda", align: "right" },
  { name: "Destaques", align: "right" },
  { name: "Lucro BRL", align: "right" },
  { name: "Lucro %", align: "center" },
  { name: "", align: "right" },
];

export default function ModalView({ open, setOpen, month, data }: ModalView) {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState();

  if (editOpen)
    return (
      <ModalUpdate
        open={editOpen}
        setOpen={setEditOpen}
        month={month}
        data={dataUpdate}
      />
    );

  if (!open || !data) return;
  const nameMonth = months.find((m) => m.number === month)?.name;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="py-3 px-4 flex items-center justify-between">
          <p></p>
          <h2 className="text-xl font-semibold text-center col-span-12">
            Seus Itens de {nameMonth}
          </h2>
          <AiOutlineCloseSquare
            onClick={() => setOpen(false)}
            size={22}
            className="cursor-pointer"
          />
        </div>
        <Table columns={columns} pagination={data.length > 10}>
          {data.map((item: any, key: number) => {
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
                    {item.name.stringValue}
                  </button>
                </Th>
                <Td align="right">
                  {formatBrl(
                    item.buyPrice.integerValue || item.buyPrice.doubleValue
                  )}
                </Td>
                <Td align="right">
                  {formatBrl(
                    item.sellPrice.integerValue || item.sellPrice.doubleValue
                  )}
                </Td>
                <Td align="right">
                  {formatBrl(
                    item.highlights.integerValue || item.highlights.doubleValue
                  )}
                </Td>
                <Td align="right">
                  {formatBrl(
                    item.realProfit.integerValue || item.realProfit.doubleValue
                  )}
                </Td>
                <Td align="center">{item.percentage.doubleValue}%</Td>
                <Td align="right">
                  <button
                    onClick={() => handleDelete(nameMonth, item.id)}
                    className="p-1.5 bg-red-400 hover:bg-red-500 rounded-md text-white"
                  >
                    <BiTrashAlt size={16} />
                  </button>
                </Td>
              </tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
}

async function handleDelete(month: any, id: string) {
  if (confirm("Tem certeza que deseja deletar este item?"))
    try {
      await deleteDoc(doc(db, month, id));
      toast.success("Item excluido com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao excluir o item: ", err);
    }
}
