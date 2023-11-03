"use client";
import { Button, ResetForm } from "design-system-toshyro";
import { BiChevronDown } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import InputCs from "@/components/inputs/Input";
import SelectCs from "@/components/inputs/Select";

export default function Filter() {
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  const {
    filter,
    soldFilter,
    tableOrderBy,
    setOrderBy,
    setFilter,
    setSoldFilter
  } = useUser();

  function handleSearch(e: any) {
    setOrderBy({field: e.orderBy, direction: e.direction});
    setFilter(e.name)
    setSoldFilter(e.sold);
  }

  return (
    <>
      <button onClick={() => setFilterOpen(!filterOpen)} className="py-2 px-4 flex items-center justify-between border-b border-t w-full dark:border-slate-600">
        <div className="flex items-center gap-3 text-sm">
          <FaFilter />
          <p>Filtro</p>
        </div>
        <BiChevronDown className={`duration-300 ${filterOpen ? "rotate-180" : ""}`} />
      </button>
      <ResetForm className={`overflow-hidden duration-300 ease-in-out grid grid-cols-12 items-center gap-4 px-4 ${filterOpen ? "max-h-32 border-b py-2 dark:border-slate-600" : "max-h-0"}`}>
        <InputCs label="Nome" name="name" width="col-span-4" defaultValue={filter} />
        <SelectCs label="Ordenar Por" name="orderBy" width="col-span-2" options={OrderByOptions} value={tableOrderBy.field} />
        <SelectCs label="Ordem" name="direction" width="col-span-2" options={DirectionOptions} value={tableOrderBy.direction} />
        <SelectCs label="Vendido" name="sold" width="col-span-2" options={SoldOptions} value={soldFilter} />
        <div className="col-span-2 h-full flex justify-end items-center">
          <Button title="Pesquisar" size="sm" onSubmit={handleSearch} />
        </div>
      </ResetForm>
    </>
  )
}

export enum SoldOptionsEnum {
  ALL = "0",
  SOLD = "1",
  NOT_SOLD = "2"
}

export const OrderByOptions = [
  { key: 'date', value: "Data" },
  { key: 'buyPrice', value: "Preço" },
]

export const DirectionOptions = [
  { key: "desc", value: "Decrescente" },
  { key: "asc", value: "Crescente" },
]

export const SoldOptions = [
  { value: "Todos", key: SoldOptionsEnum.ALL },
  { value: "Vendidos", key: SoldOptionsEnum.SOLD },
  { value: "Não Vendidos", key: SoldOptionsEnum.NOT_SOLD },
]
