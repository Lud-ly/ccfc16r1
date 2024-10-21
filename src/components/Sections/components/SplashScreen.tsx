import React, { useState, useEffect } from "react";
import Image from "next/image";
import anime from "animejs";
import { useRouter } from "next/navigation";

const SplashScreen = ({ finishLoading }: { finishLoading: () => void }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showLogo1, setShowLogo1] = useState(true); // État pour contrôler l'affichage du logo 1
  const [bgColor, setBgColor] = useState("white"); // Couleur de fond initiale
  const router = useRouter();

  const animate = () => {
    const loader = anime.timeline({
      complete: () => {
        finishLoading();
        setTimeout(() => {
          router.push("/"); // Redirection vers la page d'accueil
        }, 3000);
      },
    });

    loader
      .add({
        targets: "#logo1",
        scale: [0, 1],
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo1",
        delay: 100,
        scale: 1.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo1",
        delay: 100,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo1",
        opacity: 0, // Fait disparaître le logo 1
        duration: 500,
        easing: "easeInOutExpo",
        complete: () => setShowLogo1(false), // Met à jour l'état pour cacher le logo 1
      })
      .add({
        targets: "#logo2",
        scale: [0, 1],
        duration: 500,
        easing: "easeInOutExpo",
        begin: () => {
          setBgColor("rgb(9, 87, 159)"); // Change la couleur de fond
        },
        complete: () => setBgColor("rgb(9, 87, 159)"), // Assure que la couleur de fond reste
      })
      .add({
        targets: "#logo2",
        delay: 100,
        scale: 1.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo2",
        delay: 100,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: bgColor }}>
      {isMounted && (
        <>
          {showLogo1 && ( // Rendre logo1 seulement si showLogo1 est vrai
            <Image
              id="logo1"
              src="/images/lfo.png"
              alt="Logo 1"
              width={150}
              height={150}
            />
          )}
          <Image
            id="logo2"
            src="/images/logo.png"
            alt="Logo 2"
            width={150}
            height={150}
            style={{ display: showLogo1 ? 'none' : 'block' }} // Cache le logo 2 jusqu'à ce qu'il soit prêt à être affiché
          />
        </>
      )}
    </div>
  );
};

export default SplashScreen;
