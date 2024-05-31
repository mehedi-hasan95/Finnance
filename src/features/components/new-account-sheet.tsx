import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNewAccount } from "../hook/new-account-create";
import { AccountForm } from "./account-form";
import { insertUserSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../hook/use-create-account";

export const NewAccountSheet = () => {
  const { onClose, isOpen } = useNewAccount();
  const formSchema = insertUserSchema.pick({
    name: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const mutation = useCreateAccount();
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          defaultValues={{ name: "" }}
          onSubmint={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
