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
import { ReactSelect } from "@/components/common/react-select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmmountInput } from "@/components/ui/ammount-input";
import { convertMiliunitsToAmount } from "@/lib/utils";

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
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertMiliunitsToAmount(amount);
    onSubmint({
      ...values,
      amount: amountInMiliunits,
    });
  }
  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <DatePicker
                  disabled={disabled}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accounId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <ReactSelect
                  onChange={field.onChange}
                  disabled={disabled}
                  onCreate={onCreateAccount}
                  options={accountOptions}
                  placeholder="Select/Create an Account"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <ReactSelect
                  onChange={field.onChange}
                  disabled={disabled}
                  onCreate={onCreateCategories}
                  options={categoriesOptions}
                  placeholder="Select/Create a Category"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add Payee"
                  {...field}
                  disabled={disabled}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ammount</FormLabel>
              <FormControl>
                <AmmountInput
                  disabled={disabled}
                  placeholder="Ammount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Additional notes"
                  className="resize-none"
                  value={field.value || ""}
                  disabled={disabled}
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
