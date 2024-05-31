"use client";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/hook/new-account-create";

export default function Home() {
  const { onOpen } = useNewAccount();
  return (
    <div>
      <Button onClick={onOpen}>Open Account</Button>
    </div>
  );
}
