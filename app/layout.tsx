"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-800 p-6">
          <div className="max-w-md w-full text-center">
          </div>
        </div>
      </body>
    </html>
  );
}
