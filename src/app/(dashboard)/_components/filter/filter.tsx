import { AccountFilter } from "./account-filter";
import { DateFilter } from "./date-filter";

export const Filter = () => {
  return (
    <div className="flex flex-col md:flex-row md:gap-x-2 gap-y-2 md:gap-y-0">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};
