import { useEditNewAccount } from "@/features/hook/edit-create-account";

type Props = {
  account: string;
  accountId: string;
};
export const AccountColums = ({ account, accountId }: Props) => {
  const { onOpen } = useEditNewAccount();
  const onClick = () => {
    onOpen(accountId);
  };
  return (
    <div onClick={onClick} className="hover:underline cursor-pointer">
      {account}
    </div>
  );
};
