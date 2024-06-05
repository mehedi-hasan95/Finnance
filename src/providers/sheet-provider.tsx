"use client";

import { EditAccountSheet } from "@/features/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/components/new-account-sheet";
import { EditCategorySheet } from "@/use-transtack/categories/components/edit-category-sheet";
import { NewCategorySheet } from "@/use-transtack/categories/components/new-account-sheet";
import { NewTransactionSheet } from "@/use-transtack/transactions/components/new-transaction-sheet";
import { useEffect, useState } from "react";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
    </>
  );
};
