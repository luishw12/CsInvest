import { InputMaskProps } from "design-system-toshyro/lib/compoments/inputs/InputMask";
import { InputMask } from "design-system-toshyro";

export default function InputMaskCs({ label, validation, mask, alwaysShowMask, name, width, variant, maskChar, labelPosition, labelSize, saveWithMask, type, ...props }: InputMaskProps) {
  return (
    <div className={`grid grid-cols-12 ${width}`}>
      {label && (
        <label className={"block text-sm font-bold text-gray-700 mb-2 dark:text-slate-300 col-span-12"} htmlFor={name}>{label}</label>
      )}
      <InputMask
        name={name}
        mask={mask}
        validation={validation}
        width={"col-span-12"}
        {...props}
      />
    </div>
  )
}