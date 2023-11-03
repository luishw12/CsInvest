import {Select} from "design-system-toshyro";
import {SelectProps} from "design-system-toshyro/lib/compoments/inputs/Select";

export default function SelectCs({ options, name, width = "col-span-12", label, value, validation }: SelectProps) {
  return (
    <div className={`grid grid-cols-12 ${width}`}>
      {label && (
        <label className={"block text-sm font-bold text-gray-700 mb-2 dark:text-slate-300 col-span-12"} htmlFor={name}>{label}</label>
      )}
      <Select name={name} validation={validation} options={options} value={value} />
    </div>
  )
}