"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertTransactionsSchema } from "@/db/schema";

const formSchema = z.object({
  amount: z.string(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  accounId: z.string(),
  categorId: z.string().nullable().optional(),
});
const apiSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type apiFormValues = z.input<typeof apiSchema>;
type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmint: (values: apiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  onCreateCategories: (name: string) => void;
  categoriesOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  accountOptions: { label: string; value: string }[];
};

export const TransactionForm = ({
  onSubmint,
  defaultValues,
  disabled,
  id,
  onDelete,
  accountOptions,
  categoriesOptions,
  onCreateAccount,
  onCreateCategories,
}: Props) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    onSubmint(values);
  }
  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Travel etc"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled}>
          {id ? "Save Change" : "Create Cagegory"}
        </Button>

        <div className="!mt-4 p-0">
          {!!id && (
            <Button
              type="button"
              onClick={handleDelete}
              disabled={disabled}
              variant={"destructive"}
            >
              Delete Cagegory
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
