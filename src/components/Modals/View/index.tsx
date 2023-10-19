"use client";
import {Form, Switch, Table, TableObjectDto, Td, Th} from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";

import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";

import React, {useEffect, useState} from "react";
import ModalUpdate from "../Update";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { ModalView } from "../interfaces";
import ModalViewImage from "../ItemImage";
import ModalLayout from "../_Layout";
import Filter from "@/components/Modals/View/components/filter";

const columns: TableObjectDto[] = [
  { name: "Nome" },
  { name: "Dia da compra", align: "center" },
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
  setOrderBy,
  month,
  data,
  user,
  userDb,
  year
}: ModalView) {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewImageOpen, setViewImageOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState();

  const [itemImage, setItemImage] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");

  const [infos, setInfos] = useState<any>(data);
  const [filter, setFilter] = useState<string>("");

  const [sold, setSold] = useState<boolean>(false);

  useEffect(() => {
    if(filter) {
      let newInfos: any = [];
      data.forEach((info:any) => {
        if(info.name.toLowerCase().includes(filter.toLowerCase())) newInfos.push(info);
      })
      if(sold) newInfos = newInfos.filter((i:any) => i.sellPrice > 0);
      setInfos(newInfos);
      return;
    }
    if(sold) {
      const newInfos = data.filter((i:any) => i.sellPrice > 0);
      setInfos(newInfos);
      return;
    }
    setInfos(data)
  }, [data, filter, sold]);

  useEffect(() => {
    setFilter("");
    setInfos(data)
  }, [open]);

  if (editOpen) {
    return (
      <ModalUpdate
        open={editOpen}
        setOpen={setEditOpen}
        setViewOpen={setOpen}
        month={month}
        data={dataUpdate}
        user={user}
        userDb={userDb}
        year={year}
      />
    );
  }

  if (viewImageOpen) {
    return (
      <ModalViewImage
        open={viewImageOpen}
        setOpen={setViewImageOpen}
        image={itemImage}
        name={itemName}
        user={user}
      />
    );
  }

  if (!open || !data) return;

  const nameMonth = months.find((m) => m.number === month)?.name;

  return (
    <ModalLayout title={`Seus Itens de ${nameMonth}`} setOpen={setOpen} width={"w-[80%]"}>
      <>
        <Filter setOrderBy={setOrderBy} setFilter={setFilter} setSold={setSold} />
        <Table columns={columns} pagination={infos.length > 10}>
          {infos.map((item: any, key: number) => {
            async function editHighlights(type: "add" | "remove") {
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

              const docRef = doc(db, user!.uid, String(year!), nameMonth!, item.id); // itemId é o ID exclusivo do item a ser editado
              await updateDoc(docRef, docData);
            }

            const buyDate = item.date && new Date(item.date.seconds * 1000);

            return (
              <tr key={key}>
                <Th>
                  <button
                    onClick={() => {
                      setDataUpdate(item);
                      setEditOpen(true);
                      setOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                </Th>
                <Td align="center">{buyDate ? `${buyDate.getDate()} / ${buyDate.getMonth() + 1}` : "-"}</Td>
                <Td align="right">{formatBrl(item.buyPrice)}</Td>
                <Td align="right">
                  {item.sellPrice ? formatBrl(item.sellPrice) : "-"}
                </Td>
                <Td align="center">
                  <div className="flex items-center gap-2 justify-center">
                    <button onClick={() => {
                      if(item.highlights == 0) editHighlights("add")
                      if(item.highlights > 0) editHighlights("remove")
                    }}>
                      <Form className={""}>
                        <Switch name={"highlight"} value={item.highlights > 0} />
                      </Form>
                    </button>
                  </div>
                </Td>
                <Td align="right">
                  {item.sellPrice ? formatBrl(item.realProfit) : "-"}
                </Td>
                <Td align="center">
                  {item.sellPrice ? item.percentage + "%" : "-"}
                </Td>
                <Td align="right">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setDataUpdate(item);
                        setEditOpen(true);
                        setOpen(false);
                      }}
                      className="p-1.5 bg-orange-400 hover:bg-orange-500 rounded-md text-white"
                    >
                      <BsPencilSquare size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setItemImage(item.image);
                        setItemName(item.name);
                        setViewImageOpen(true);
                      }}
                      className="p-1.5 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    >
                      <AiOutlineEye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(nameMonth, item.id, user);
                        if (data.length == 1) setOpen(false);
                      }}
                      className="p-1.5 bg-red-500 hover:bg-red-600 rounded-md text-white"
                    >
                      <BiTrashAlt size={16} />
                    </button>
                  </div>
                </Td>
              </tr>
            );
          })}
        </Table>
      </>
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
