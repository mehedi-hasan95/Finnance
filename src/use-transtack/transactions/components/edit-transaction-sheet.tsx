import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertUserSchema } from "@/db/schema";
import { z } from "zod";
import { useEditNewCategories } from "../hook/edit-create-category";
import { Loader2 } from "lucide-react";
import { UseConfirm } from "@/hooks/use-confirm";
import { useUpdateTransactions } from "../api/use-update-transactions";
import { useGetSingleTransactions } from "../api/use-get-single-transactions";
import { useDeleteCategory } from "../api/use-delete-transactions";
import { TransactionForm } from "./transaction-form";

export const EditTransactionSheet = () => {
  const { onClose, isOpen, id } = useEditNewCategories();

  // Update Category
  const updateCategory = useUpdateTransactions(id);
  // Fetch the single Category
  const categoryQuery = useGetSingleTransactions(id);
  // Delete a Category
  const deleteQuery = useDeleteCategory(id);
  const formSchema = insertUserSchema.pick({
    name: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const onSubmit = (values: FormValues) => {
    updateCategory.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: "" };

  // Delete modal
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you delete the Category?",
    "You are about delete this transition."
  );
  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteQuery.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading = categoryQuery.isLoading;
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>Edit your existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmint={onSubmit}
              onDelete={onDelete}
              disabled={updateCategory.isPending || deleteQuery.isPending}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
