"use client";

import { formatDateRange } from "@/lib/utils";
import { useGetSummery } from "@/use-transtack/summery/api/use-get-summery";
import { useSearchParams } from "next/navigation";
import { DataCard, DataCardLoading } from "./data-card";
import { CreditCard, TrendingDown, TrendingUp } from "lucide-react";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummery();
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const dateRangeLabel = formatDateRange({ to, from });
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={CreditCard}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={TrendingUp}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={TrendingDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
