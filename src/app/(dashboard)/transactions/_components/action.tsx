"use client";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseConfirm } from "@/hooks/use-confirm";
import { useEditNewTransactions } from "@/use-transtack/transactions/hook/edit-create-transactions";
import { useDeleteTransactions } from "@/use-transtack/transactions/api/use-delete-transactions";
type Props = {
  id: string;
};
export const TransactionEditAction = ({ id }: Props) => {
  const { onOpen } = useEditNewTransactions();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you delete the Transaction?",
    "You are about delete this transition."
  );
  const deleteMuataion = useDeleteTransactions(id);
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMuataion.mutate(undefined, {
        onSuccess: () => {},
      });
    }
  };
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteMuataion.isPending}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Pencil className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMuataion.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
