import { cn } from "@/lib/utils";
import { useEditNewCategories } from "@/use-transtack/categories/hook/edit-create-category";
import { TriangleAlert } from "lucide-react";

type Props = {
  category: string | null;
  categoryId: string | null;
};
export const CategoryColums = ({ category, categoryId }: Props) => {
  const { onOpen } = useEditNewCategories();
  const onClick = () => {
    if (categoryId) {
      onOpen(categoryId);
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
