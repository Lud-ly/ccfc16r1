import React, { useState, useEffect } from "react";
import Image from "next/image";
import anime from "animejs";
import { useRouter } from "next/navigation";

const SplashScreen = ({ finishLoading }: { finishLoading: () => void }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const animate = () => {
    const loader = anime.timeline({
      complete: () => {
        finishLoading();
        setTimeout(() => {
          router.push("/"); // Redirection vers la page d'accueil
        }, 1000);
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
        targets: "#logo2",
        scale: [0, 1],
        duration: 500,
        easing: "easeInOutExpo",
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
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "rgb(9, 87, 159)" }}>
      {isMounted && (
        <>
          <Image
            id="logo1"
            src="/images/logo.png"
            alt="Logo 1"
            width={150}
            height={150}
          />
          <Image
            id="logo2"
            src="/images/lfo.png"
            alt="Logo 2"
            width={150}
            height={150}
            style={{ display: "none" }} // Cache le logo jusqu'à ce qu'il soit prêt à être affiché
          />
        </>
      )}
    </div>
  );
};

export default SplashScreen;
