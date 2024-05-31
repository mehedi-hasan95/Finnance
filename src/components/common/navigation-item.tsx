import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  label: string;
  isActive: boolean;
}
export const NavigationItem = ({ href, label, isActive }: Props) => {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? "outline" : "ghost"}
        className={cn(
          "w-full lg:w-auto text-white hover:text-white hover:bg-white/20 border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 transition",
          isActive ? "bg-white/20" : "bg-transparent"
        )}
      >
        {label}
      </Button>
    </Link>
  );
};
