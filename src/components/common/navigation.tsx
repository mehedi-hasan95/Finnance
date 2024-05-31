"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetTrigger,
} from "@/components/ui/sheet";

import { usePathname } from "next/navigation";
import { NavigationItem } from "./navigation-item";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { Logo } from "./logo";

export const Navigation = () => {
  const MenuList = [
    { href: "/", label: "Overview" },
    { href: "/transactions", label: "Transactions" },
    { href: "/accounts", label: "Accounts" },
    { href: "/categories", label: "Categories" },
    { href: "/settings", label: "Settings" },
  ];
  const pathName = usePathname();
  return (
    <div>
      <div className="hidden md:flex gap-5">
        {MenuList.map((item) => (
          <NavigationItem
            isActive={pathName === item.href}
            href={item.href}
            label={item.label}
            key={item.href}
          />
        ))}
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 w-6 cursor-pointer text-white" />
          </SheetTrigger>
          <SheetOverlay className="bg-white/40" />
          <SheetContent side={"left"}>
            <nav className="flex flex-col gap-3 mt-4">
              {MenuList.map((item) => (
                <Link href={item.href} key={item.href}>
                  <Button
                    variant={item.href === pathName ? "secondary" : "ghost"}
                    className={cn("w-full")}
                  >
                    <SheetClose className="w-full flex justify-start">
                      {item.label}
                    </SheetClose>
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
