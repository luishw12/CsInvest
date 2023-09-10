"use client";
import { Table, TableObjectDto, Td, Th } from "design-system-toshyro";
import { formatBrl, months } from "@/components/Calender";
import { ModalProps } from "../Register";

import { AiOutlineCloseSquare } from "react-icons/ai";

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
];

export default function ModalView({ open, setOpen, month, data }: ModalView) {
  if (!open || !data) return;

  console.log(data);

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
        <Table columns={columns}>
          {data.map((item: any, key: number) => {
            return (
              <tr key={key}>
                <Th>{item.name.stringValue}</Th>
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
                <Td align="center">
                  {Math.round(
                    item.porcentage.integerValue ||
                      item.porcentage.doubleValue * 10000
                  ) / 100}
                  %
                </Td>
              </tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
}
