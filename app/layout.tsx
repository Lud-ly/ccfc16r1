"use client";

import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';
import BottomNavBar from "~/src/components/Sections/components/BottomNavBar";
import SplashScreen from "~/src/components/Sections/components/SplashScreen";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChickenSoccerStory from "~/src/components/Sections/components/ChickenSoccerStory";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isHome = pathName === "/";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifie si le splash screen a déjà été affiché
    const hasShownSplash = localStorage.getItem("hasShownSplash");

    if (!hasShownSplash && isHome) {
      setIsLoading(true); // Affiche le splash screen si c'est la première visite
    } else {
      setIsLoading(false); // Sinon, ne pas afficher 
    }
  }, [isHome]);

  const handleFinishLoading = () => {
    setIsLoading(false);
    localStorage.setItem("hasShownSplash", "true");
  };

  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
      {/* <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Accès réservé aux membres</h1>
        <p className="text-lg mb-6">
          Cette section est exclusivement réservée aux membres.
        </p>
        <ChickenSoccerStory/>
      </div>
    </div> */}
        {/* {isLoading ? (
          <SplashScreen finishLoading={handleFinishLoading} />
        ) : (
          <>
            <Header />
            <main className="flex-grow">{children}</main>
            <BackToTopButton />
            <BottomNavBar />
            <Footer />
          </>
        )} */}
      </body>
    </html>
  );
}
