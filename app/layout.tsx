"use client"

import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';
import BottomNavBar from "~/src/components/Sections/components/BottomNavBar";
import SplashScreen from "~/src/components/Sections/components/SplashScreen";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathName = usePathname();
  const isHome = pathName === "/";
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) return;

  }, [isLoading]);


  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)} />) :
          <>
            <Header />
            <main className="flex-grow">{children}</main>
            <BackToTopButton />
            <BottomNavBar />
            <Footer />
          </>
        }
      </body>
    </html>
  );
}
