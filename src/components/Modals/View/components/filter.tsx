"use client";
import { Button, Input, ResetForm, Select } from "design-system-toshyro";
import { BiChevronDown } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

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
        <Input label="Nome" name="name" width="col-span-4" defaultValue={filter} />
        <Select label="Ordenar Por" name="orderBy" width="col-span-2" options={OrderByOptions} defaultValue={tableOrderBy.field} />
        <Select label="Ordem" name="direction" width="col-span-2" options={DirectionOptions} defaultValue={tableOrderBy.direction} />
        <Select label="Vendido" name="sold" width="col-span-2" options={SoldOptions} defaultValue={soldFilter} />
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
  { value: 'date', label: "Data" },
  { value: 'buyPrice', label: "Preço" },
]

export const DirectionOptions = [
  { value: "desc", label: "Decrescente" },
  { value: "asc", label: "Crescente" },
]

export const SoldOptions = [
  { label: "Todos", value: SoldOptionsEnum.ALL },
  { label: "Vendidos", value: SoldOptionsEnum.SOLD },
  { label: "Não Vendidos", value: SoldOptionsEnum.NOT_SOLD },
]
