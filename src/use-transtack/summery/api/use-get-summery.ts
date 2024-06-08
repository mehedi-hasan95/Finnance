import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummery = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId") || "";
  const query = useQuery({
    queryKey: ["summery", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summery.$get({
        query: { from, to, accountId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summery");
      }
      const { data } = await response.json();
      console.log("summery:", data);
      return {
        ...data,
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        remainingChange: data.remainingChange,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        incomeChange: data.incomeChange,
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        expensesChange: data.expensesChange,
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });
  return query;
};
