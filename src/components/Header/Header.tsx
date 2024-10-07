"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../Sections/components/Navigation";

export const Header = () => {
  return (
    <div
      className="p-3 flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgb(9, 87, 159)" }}
    >
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="logo ccfc"
          width={50}
          height={50}
          priority
        />
      </Link>
      <Navigation />
    </div>
  );
};
