"use client";
import {Form, Switch, Table, TableObjectDto, Td, Th} from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";

import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";

import React, {useEffect, useState} from "react";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { ModalView } from "../interfaces";
import ModalLayout from "../_Layout";
import Filter from "@/components/Modals/View/components/filter";
import {useUser} from "@/context/UserContext";
import _ from 'lodash';

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
}: ModalView) {
  const {
    monthSelected,
    user,
    infos, userDb,
    year,
    setDataItem,
    setEditOpen,
    setViewImageOpen,
    tableOrderBy
  } = useUser();

  const [viewItems, setViewItems] = useState<any>(infos);
  const [filter, setFilter] = useState<string>("");

  const [sold, setSold] = useState<boolean>(false);

  useEffect(() => {
    if(filter) {
      let newInfos: any = [];
      infos.forEach((info:any) => {
        if(info.name.toLowerCase().includes(filter.toLowerCase())) newInfos.push(info);
      })
      if(sold) newInfos = newInfos.filter((i:any) => i.sellPrice > 0);
      setViewItems(newInfos);
      return;
    }
    if(sold) {
      const newInfos = infos.filter((i:any) => i.sellPrice > 0);
      setViewItems(newInfos);
      return;
    }
    if(tableOrderBy) {
      const newInfos = _.orderBy(infos, [tableOrderBy.field], [tableOrderBy.direction]);
      setViewItems(newInfos);
      return;
    }
    setViewItems(infos)
  }, [filter, sold, tableOrderBy, infos]);

  useEffect(() => {
    setFilter("");
    setViewItems(infos)
  }, [open]);

  if (!open || !infos || !viewItems) return;

  const nameMonth = months.find((m) => m.number === monthSelected)?.name;

  return (
    <ModalLayout title={`Seus Itens de ${nameMonth}`} setOpen={setOpen} width={"w-[80%]"}>
      <>
        <Filter setFilter={setFilter} setSold={setSold} />
        <Table columns={columns} pagination={viewItems.length > 10}>
          {viewItems.map((item: any, key: number) => {
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
                      setDataItem(item);
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
                        setDataItem(item);
                        setEditOpen(true);
                        setOpen(false);
                      }}
                      className="p-1.5 bg-orange-400 hover:bg-orange-500 rounded-md text-white"
                    >
                      <BsPencilSquare size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDataItem(item);
                        setViewImageOpen(true);
                      }}
                      className="p-1.5 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    >
                      <AiOutlineEye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(nameMonth, item.id, user);
                        if (infos.length == 1) setOpen(false);
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
