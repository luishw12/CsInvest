"use client";
import { Button, InputMask, ResetForm, Select, Input } from "design-system-toshyro";
import { BiChevronDown } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import {Dispatch, SetStateAction, useState} from "react";

interface FilterProps {
  setOrderBy: Dispatch<SetStateAction<string>>;
  setFilter: Dispatch<SetStateAction<string>>;
}

export default function Filter({ setOrderBy, setFilter }: FilterProps) {
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  function handleSearch(e: any) {
    setOrderBy(e.orderBy);
    setFilter(e.name)
  }

  return (
    <>
      <button onClick={() => setFilterOpen(!filterOpen)} className="py-2 px-4 flex items-center justify-between border-b border-t w-full">
        <div className="flex items-center gap-3 text-sm">
          <FaFilter />
          <p>Filtro</p>
        </div>
        <BiChevronDown className={`duration-300 ${filterOpen ? "rotate-180" : ""}`} />
      </button>
      <ResetForm className={`overflow-hidden duration-300 ease-in-out grid grid-cols-12 items-center gap-4 px-4 ${filterOpen ? "max-h-32 border-b py-2" : "max-h-0"}`}>
        <Input label="Nome" name="name" width="col-span-6" />
        <Select label="Ordenar Por" name="orderBy" width="col-span-4" options={OrderByOptions} />
        <div className="col-span-2 h-full flex justify-end items-center">
          <Button title="Pesquisar" size="sm" onSubmit={handleSearch} />
        </div>
      </ResetForm>
    </>
  )
}

export const OrderByOptions = [
  { key: 'buyPrice', value: "Preço" },
  { key: 'date', value: "Data" },
]