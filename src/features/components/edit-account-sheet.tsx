import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AccountForm } from "./account-form";
import { insertUserSchema } from "@/db/schema";
import { z } from "zod";
import { useEditNewAccount } from "../hook/edit-create-account";
import { useGetSingleAccount } from "../accounts/api/use-get-single-account";
import { Loader2 } from "lucide-react";
import { useUpdateAccount } from "../accounts/api/use-update-account";
import { useDeleteAccount } from "../accounts/api/use-delete-account";
import { UseConfirm } from "@/hooks/use-confirm";

export const EditAccountSheet = () => {
  const { onClose, isOpen, id } = useEditNewAccount();

  // Update Account
  const updateAccount = useUpdateAccount(id);
  // Fetch the single account
  const accountQuery = useGetSingleAccount(id);
  // Delete a account
  const deleteQuery = useDeleteAccount(id);
  const formSchema = insertUserSchema.pick({
    name: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const onSubmit = (values: FormValues) => {
    updateAccount.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" };

  // Delete modal
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you delete the account?",
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

  const isLoading = accountQuery.isLoading;
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>Edit your existing account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmint={onSubmit}
              onDelete={onDelete}
              disabled={updateAccount.isPending || deleteQuery.isPending}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
