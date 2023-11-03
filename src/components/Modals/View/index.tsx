"use client";
import {Table, TableObjectDto, Td, Th} from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";

import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";

import React, {useEffect, useState} from "react";
import { ModalView } from "../interfaces";
import ModalLayout from "../_Layout";
import Filter, {SoldOptionsEnum} from "@/components/Modals/View/components/filter";
import {useUser} from "@/context/UserContext";
import _ from 'lodash';
import {AntSwitch} from "design-system-toshyro/lib/compoments/inputs/Switch/antSwitch";

const columns: TableObjectDto[] = [
  { name: "Nome" },
  { name: "Dia da compra", align: "center" },
  { name: "Valor Compra", align: "right" },
  { name: "Valor Venda", align: "right" },
  { name: "Vendido", align: "center" },
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
    infos,
    setDataItem,
    setEditOpen,
    setViewImageOpen,
    tableOrderBy,
    filter,
    soldFilter,
    viewItems,
    setViewItems,
    theme,
    editSold,
    editHighlights,
    handleDelete,
  } = useUser();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (!infos || !infos.length) {
      // Se 'infos' não existir ou estiver vazio, não há nada para filtrar ou classificar.
      setViewItems([]);
      setLoading(false);
      return;
    }

    let filteredInfos = [...infos]; // Comece com uma cópia das infos originais

    if (filter) {
      filteredInfos = filteredInfos.filter((info) => info.name.toLowerCase().includes(filter.toLowerCase()));
    }

    switch (soldFilter) {
      case SoldOptionsEnum.SOLD:
        filteredInfos = filteredInfos.filter((info) => info.sold == true);
        break;
      case SoldOptionsEnum.NOT_SOLD:
        filteredInfos = filteredInfos.filter((info) => info.sold != true);
        break;
    }

    if (tableOrderBy) {
      const { field, direction } = tableOrderBy;
      filteredInfos = _.orderBy(filteredInfos, [field], [direction]);
    }

    setViewItems(filteredInfos);
    setLoading(false);
  }, [filter, soldFilter, tableOrderBy, infos]);

  useEffect(() => {
    setLoading(true);
    setTimeout(()=> {
      setLoading(false)
    }, 10)
  }, [viewItems]);

  if (!open || !infos || !viewItems) return;

  const nameMonth = months.find((m) => m.number === monthSelected)?.name!;

  return (
    <ModalLayout title={`Seus Itens de ${nameMonth}`} qntItens={viewItems.length} setOpen={setOpen} width={"w-[80%]"}>
      <>
        <Filter />
        <div className={"max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-900 dark:scrollbar-track-gray-600"}>
          <Table columns={columns} theme={theme}>
          {viewItems.map((item: any, key: number) => {
            const buyDate = item.date && new Date(item.date.seconds * 1000);

            return (
              <tr key={key} className={"dark:bg-slate-800"}>
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
                    {!loading && <AntSwitch defaultChecked={item.sold} onChange={() => editSold(item)} inputProps={{ 'aria-label': 'ant design' }} />}
                  </div>
                </Td>
                <Td align="center">
                  <div className="flex items-center gap-2 justify-between w-[90px]">
                    <button
                      type={"button"}
                      className={"h-4 w-4 rounded-md flex items-center justify-center text-red-500 font-bold bg-gray-300 dark:bg-slate-600 outline-none hover:ring-1 ring-red-500"}
                      onClick={()=>editHighlights(item, "remove")}>
                      -
                    </button>
                    <div>{formatBrl(item.highlights ? typeof item.highlights == "boolean" ? 2 : item.highlights : 0)}</div>
                    <button
                      type={"button"}
                      className={"h-4 w-4 rounded-md flex items-center justify-center text-blue-500 font-bold bg-gray-300 dark:bg-slate-600 outline-none hover:ring-1 ring-blue-500"}
                      onClick={()=>editHighlights(item, "add")}>
                      +
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
                        handleDelete(item.id);
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
        </div>
      </>
    </ModalLayout>
  );
}
