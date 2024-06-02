import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategory } from "../hook/new-category-create";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { CategoryForm } from "./category-form";
import { useCreateCategory } from "../api/use-create-category";

export const NewCategorySheet = () => {
  const { onClose, isOpen } = useNewCategory();
  const formSchema = insertCategorySchema.pick({
    name: true,
  });
  type FormValues = z.input<typeof formSchema>;
  const mutation = useCreateCategory();
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
          <SheetTitle>Create an category</SheetTitle>
          <SheetDescription>
            Create an category to trac your transition
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          defaultValues={{ name: "" }}
          onSubmint={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
