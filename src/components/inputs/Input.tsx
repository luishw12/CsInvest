import {Input} from "design-system-toshyro";
import {InputProps} from "design-system-toshyro/lib/compoments/inputs/Input";

export default function InputCs({ label, validation, name, width = "col-span-12", ...props }: InputProps) {
  return (
    <div className={`grid grid-cols-12 ${width}`}>
      {label && (
        <label className={"block text-sm font-bold text-gray-700 mb-2 dark:text-slate-300 col-span-12"} htmlFor={name}>{label}</label>
      )}
      <Input name={name} validation={validation} {...props} />
    </div>
  )
}