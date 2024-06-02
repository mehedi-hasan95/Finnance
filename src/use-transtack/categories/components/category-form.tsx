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
import { insertCategorySchema } from "@/db/schema";

const formSchema = insertCategorySchema.pick({
  name: true,
});
type FormValues = z.input<typeof formSchema>;
type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmint: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const CategoryForm = ({
  onSubmint,
  defaultValues,
  disabled,
  id,
  onDelete,
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
