import { CgSpinnerTwo } from "react-icons/cg";

export default function TableSkeleton() {
  return (
    <div className="w-full h-20 flex items-center justify-center animate-[spin_0.8s_ease-in-out_infinite] text-3xl text-gray-600">
      <CgSpinnerTwo />
    </div>
  );
}