import { cn } from "@/lib/utils";
import { useEditNewCategories } from "@/use-transtack/categories/hook/edit-create-category";
import { useEditNewTransactions } from "@/use-transtack/transactions/hook/edit-create-transactions";
import { TriangleAlert } from "lucide-react";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};
export const CategoryColums = ({ id, category, categoryId }: Props) => {
  const { onOpen } = useEditNewCategories();
  const { onOpen: transaction } = useEditNewTransactions();
  const onClick = () => {
    if (categoryId) {
      onOpen(categoryId);
    } else {
      transaction(id);
    }
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        "hover:underline cursor-pointer flex items-center",
        !category && "text-red-500"
      )}
    >
      {!category && <TriangleAlert className="size-4 mr-2" />}
      {category || "Uncategorize"}
    </div>
  );
};
