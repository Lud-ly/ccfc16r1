"use client";

import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <div
      className="p-4 flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgb(9, 87, 159)" }}
    >
      <Link href={"/"}>
        <Image src="/images/logo.png" alt="logo ccfc" width={60} height={60} />
      </Link>
      <p className="text-white text-xl font-semibold">U16 Régional 1</p>
    </div>
  );
};
