"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNewAccount } from "@/features/hook/new-account-create";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/common/data-table";
import { Loader2, Plus } from "lucide-react";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccount } from "@/features/accounts/api/use-bulk-delete";
import { Skeleton } from "@/components/ui/skeleton";

const Account = () => {
  // Open the sheet
  const account = useNewAccount();

  // Fetch all account
  const accountQuery = useGetAccounts();
  const data = accountQuery.data || [];
  const deleteAccounts = useBulkDeleteAccount();
  // Disabled the button
  const isLoading = deleteAccounts.isPending || accountQuery.isLoading;

  if (accountQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 -mt-10 md:-mt-16 lg:-mt-20">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
              <CardTitle className="font-bold md:text-2xl">
                <Skeleton className="w-20 h-8" />
              </CardTitle>
              <Skeleton className="w-20 h-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-36 md:h-56 lg:h-96">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto px-4 -mt-10 md:-mt-16 lg:-mt-20">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <CardTitle className="font-bold md:text-2xl">
              Accounts Page
            </CardTitle>{" "}
            <Button onClick={account.onOpen} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isLoading}
            searchKey="email"
            columns={columns}
            data={data}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
