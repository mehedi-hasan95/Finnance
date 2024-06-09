"use client";

import { useGetSummery } from "@/use-transtack/summery/api/use-get-summery";
import { Chart } from "./chart";
import { Loader2 } from "lucide-react";
import { SpendingPie } from "./spending-pie";

export const DataChart = () => {
  const { data, isLoading } = useGetSummery();
  if (isLoading) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 h-72 md:h-96 justify-center items-center grid">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};
