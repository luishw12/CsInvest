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
    editSold,
    editHighlights,
    handleDelete,
  } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [viewItems, setViewItems] = useState<any>(infos);
  const [filter, setFilter] = useState<string>("");
  const [soldFilter, setSoldFilter] = useState<SoldOptionsEnum>(SoldOptionsEnum.ALL);

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

  useEffect(() => {
    setFilter("");
    setViewItems(infos)
  }, [open]);

  if (!open || !infos || !viewItems) return;

  const nameMonth = months.find((m) => m.number === monthSelected)?.name!;

  return (
    <ModalLayout title={`Seus Itens de ${nameMonth}`} qntItens={viewItems.length} setOpen={setOpen} width={"w-[80%]"}>
      <>
        <Filter setFilter={setFilter} setSold={setSoldFilter} />
        <div className={"max-h-[calc(100vh-400px)] overflow-y-auto"}>
          <Table columns={columns}>
          {viewItems.map((item: any, key: number) => {
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
                    {!loading && <AntSwitch defaultChecked={item.sold} onChange={() => editSold(item)} inputProps={{ 'aria-label': 'ant design' }} />}
                  </div>
                </Td>
                <Td align="center">
                  <div className="flex items-center gap-2 justify-center">
                    {!loading && <AntSwitch defaultChecked={item.highlights > 0} onChange={() => editHighlights(item)} inputProps={{ 'aria-label': 'ant design' }} />}
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
