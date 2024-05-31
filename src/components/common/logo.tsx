import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.webp" alt="Finnance" height={40} width={40} />
      <h2 className="text-xl font-bold md:text-2xl text-black md:text-white">
        Finnance
      </h2>
    </Link>
  );
};
