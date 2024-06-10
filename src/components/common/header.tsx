import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "./logo";
import { Navigation } from "./navigation";
import { Filter } from "@/app/(dashboard)/_components/filter/filter";

export const Header = async () => {
  const user = await currentUser();
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-8 md:px-8 lg:px-20 pb-20 lg:pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex gap-x-16">
          <div className="hidden md:block">
            <Logo />
          </div>
          <Navigation />
          <div className="ml-auto">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        <div className="space-y-2 pt-5 md:pt-7 lg:pt-10 pb-5">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Wellcome Back {user?.firstName}
          </h2>
          <p className="text-[#85B7FF]">This is your finincial report</p>
        </div>
        <Filter />
      </div>
    </div>
  );
};
