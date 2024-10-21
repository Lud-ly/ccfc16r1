"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../Sections/components/Navigation";

export const Header = () => {
  const handleLogoClick = () => {
    localStorage.removeItem("hasShownSplash");
  };

  return (
    <div
      className="p-1 flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgb(9, 87, 159)" }}
    >
      <Link href="/" onClick={handleLogoClick}>
        <Image
          src="/images/logo.png"
          alt="logo ccfc"
          width={70}
          height={70}
          priority
        />
      </Link>
      <Navigation />
    </div>
  );
};
