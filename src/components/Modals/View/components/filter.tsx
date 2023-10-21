"use client";
import {Button, ResetForm, Select, Input, CheckBox} from "design-system-toshyro";
import { BiChevronDown } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import {Dispatch, SetStateAction, useState} from "react";
import {OrderByDirection} from "firebase/firestore";
import {useUser} from "@/context/UserContext";

interface FilterProps {
  setFilter: Dispatch<SetStateAction<string>>;
  setSold: Dispatch<SetStateAction<boolean>>;
}

export default function Filter({ setFilter, setSold }: FilterProps) {
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  const {setOrderBy} = useUser();

  function handleSearch(e: any) {
    setOrderBy({field: e.orderBy, direction: e.direction});
    setFilter(e.name)
    setSold(e.sold);
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
        <Input label="Nome" name="name" width="col-span-4" />
        <Select label="Ordenar Por" name="orderBy" width="col-span-2" options={OrderByOptions} />
        <Select label="Ordem" name="direction" width="col-span-2" options={DirectionOptions} />
        <div className={"col-span-2 flex justify-center"}>
          <CheckBox name={"sold"} label={"Vendido"} />
        </div>
        <div className="col-span-2 h-full flex justify-end items-center">
          <Button title="Pesquisar" size="sm" onSubmit={handleSearch} />
        </div>
      </ResetForm>
    </>
  )
}

export const OrderByOptions = [
  { key: 'date', value: "Data" },
  { key: 'buyPrice', value: "Preço" },
]

export const DirectionOptions = [
  { key: "desc", value: "Decrescente" },
  { key: "asc", value: "Crescente" },
]