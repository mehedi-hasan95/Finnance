"use client";

import qs from "query-string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetSummery } from "@/use-transtack/summery/api/use-get-summery";

export const AccountFilter = () => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const { isLoading: loadingSummery } = useGetSummery();
  const { data, isLoading } = useGetAccounts();

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };
    if (newValue === "all") {
      query.accountId = "";
    }
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoading || loadingSummery}
    >
      <SelectTrigger className="w-auto outline-none focus:outline-none border-none focus:ring-offset-0 focus:ring-transparent">
        <SelectValue placeholder="All Accounts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {data?.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
