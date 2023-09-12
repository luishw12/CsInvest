"use client";
import Calender from "@/components/Calender";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  return (
    <div className="h-[calc(100%-82px)] flex flex-col items-center justify-center p-10">
      <Calender user={user} />
    </div>
  );
}
