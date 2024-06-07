"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/common/data-table";
import { Loader2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/use-transtack/transactions/hook/new-transaction-create";
import { useGetTransactions } from "@/use-transtack/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/use-transtack/transactions/api/use-bulk-delete-transactions";

const TransactionsPage = () => {
  // Open the sheet
  const transactions = useNewTransaction();

  // Fetch all transactions
  const transactionQuery = useGetTransactions();
  const data = transactionQuery.data || [];
  const deleteTransactions = useBulkDeleteTransactions();

  // Disabled the button
  const isLoading = deleteTransactions.isPending || transactionQuery.isLoading;

  if (transactionQuery.isLoading) {
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
              Transactions Page
            </CardTitle>{" "}
            <Button onClick={transactions.onOpen} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isLoading}
            searchKey="account"
            columns={columns}
            data={data}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
