import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionsSchema, insertUserSchema } from "@/db/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { UseConfirm } from "@/hooks/use-confirm";
import { useUpdateTransactions } from "../api/use-update-transactions";
import { useGetSingleTransactions } from "../api/use-get-single-transactions";
import { TransactionForm } from "./transaction-form";
import { useEditNewTransactions } from "../hook/edit-create-transactions";
import { useDeleteTransactions } from "../api/use-delete-transactions";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetCategories } from "@/use-transtack/categories/api/use-get-categories";
import { useCreateCategory } from "@/use-transtack/categories/api/use-create-category";

export const EditTransactionSheet = () => {
  const { onClose, isOpen, id } = useEditNewTransactions();

  // Update Category
  const updateTransaction = useUpdateTransactions(id);
  // Fetch the single Category
  const getTransaction = useGetSingleTransactions(id);
  // Delete a Category
  const deleteTransaction = useDeleteTransactions(id);

  // Test
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
  // Test
  const formSchema = insertTransactionsSchema.omit({
    id: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const onSubmit = (values: FormValues) => {
    updateTransaction.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = getTransaction.data
    ? {
        accountId: getTransaction.data.accountId,
        payee: getTransaction.data.payee,
        amount: getTransaction.data.amount.toString(),
        date: getTransaction.data.date
          ? new Date(getTransaction.data.date)
          : new Date(),
        categoryId: getTransaction.data.categoryId,
        notes: getTransaction.data.notes,
      }
    : {
        accountId: "",
        payee: "",
        amount: "",
        date: new Date(),
        categoryId: "",
        notes: "",
      };

  // Delete modal
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you delete the Category?",
    "You are about delete this transition."
  );
  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTransaction.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };
  const disabled =
    createAccount.isPending ||
    createCategories.isPending ||
    getTransaction.isPending;
  const isLoading = getTransaction.isLoading;
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>Edit your existing Transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onDelete={onDelete}
              defaultValues={defaultValues}
              onSubmint={onSubmit}
              disabled={disabled}
              onCreateCategories={onCreateCategories}
              categoriesOptions={categoriesOptions}
              onCreateAccount={onCreateAccount}
              accountOptions={accountOptions}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
