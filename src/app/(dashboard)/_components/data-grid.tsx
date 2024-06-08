"use client";

import { formatDateRange } from "@/lib/utils";
import { useGetSummery } from "@/use-transtack/summery/api/use-get-summery";
import { useSearchParams } from "next/navigation";
import { DataCard } from "./data-card";
import { CreditCard } from "lucide-react";

export const DataGrid = () => {
  const { data } = useGetSummery();
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const dateRangeLabel = formatDateRange({ to, from });
  return (
    <div>
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={CreditCard}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
