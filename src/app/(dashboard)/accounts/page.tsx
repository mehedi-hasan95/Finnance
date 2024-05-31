"use client";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

const Account = () => {
  const { data: accounts, isLoading } = useGetAccounts();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {accounts?.map((account) => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
};

export default Account;
