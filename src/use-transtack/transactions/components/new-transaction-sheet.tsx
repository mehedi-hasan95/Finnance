import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { useNewTransaction } from "../hook/new-transaction-create";
import { useCreateTransactions } from "../api/use-create-transactions";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetCategories } from "@/use-transtack/categories/api/use-get-categories";
import { useCreateCategory } from "@/use-transtack/categories/api/use-create-category";
import { TransactionForm } from "./transaction-form";

export const NewTransactionSheet = () => {
  const { onClose, isOpen } = useNewTransaction();
  const formSchema = insertTransactionsSchema.omit({
    id: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const mutation = useCreateTransactions();
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  // Account
  const getAccounts = useGetAccounts();
  const createAccount = useCreateAccount();
  const onCreateAccount = (name: string) => createAccount.mutate({ name });
  const accountOptions = (getAccounts.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));
  // Category
  const getCategoryies = useGetCategories();
  const createCategories = useCreateCategory();
  const onCreateCategories = (name: string) =>
    createCategories.mutate({ name });
  const categoriesOptions = (getCategoryies.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const disabled =
    mutation.isPending || createAccount.isPending || createCategories.isPending;
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a Transaction</SheetTitle>
          <SheetDescription>
            Create a transaction to your transition
          </SheetDescription>
        </SheetHeader>
        <TransactionForm
          onSubmint={onSubmit}
          disabled={disabled}
          onCreateCategories={onCreateCategories}
          categoriesOptions={categoriesOptions}
          onCreateAccount={onCreateAccount}
          accountOptions={accountOptions}
        />
      </SheetContent>
    </Sheet>
  );
};
