import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Slider from "react-slick"; // Importer le composant Slider
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaList,
  FaFutbol,
  FaTrophy,
} from "react-icons/fa";
import SocialMediaLinks from "./SocialMediaLinks";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.id === "popup") {
      setIsOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Configurer les paramètres du carousel
  const settings = {
    dots: false, // Activer les points de pagination
    infinite: true, // Boucle infinie
    speed: 500, // Vitesse de transition
    slidesToShow: 1, // Nombre d'éléments à afficher à la fois
    slidesToScroll: 1, // Nombre d'éléments à défiler à la fois
    autoplay: true, // Activer le défilement automatique
    autoplaySpeed: 3000, // Temps (en ms) entre les défilements
    pauseOnHover: true, // Mettre en pause le défilement lors du survol
  };

  return (
    <nav className="shadow-md">
      <div className="flex justify-between items-center p-4">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "🐔" : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          id="popup"
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-[rgb(9,87,159)] bg-opacity-50 w-3/4 sm:w-1/3 h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-10">
              <div className="home flex flex-row items-center">
                <Image
                  src="/images/logo.png"
                  alt="logo ccfc"
                  width={70}
                  height={70}
                  priority
                />
                <h1 className="ml-2 text-xl font-bold text-white">U16 R1</h1>
              </div>
              <button
                className="text-white focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex justify-end items-center mb-10">
              <SocialMediaLinks />
            </div>
            <Link
              href="/classement"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaTrophy className="mr-2 text-white" /> Classement
            </Link>
            <Link
              href="/matchs"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaCalendarAlt className="mr-2 text-white" /> Nos Matchs
            </Link>
            <Link
              href="/tous-les-matchs"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaList className="mr-2 text-white" /> Tous les Matchs
            </Link>
            <Link
              href="/stats"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaChartLine className="mr-2 text-white" /> Stats
            </Link>

            {/* Carousel des GIFs */}
            <div className="mt-4">
              <Slider {...settings}>
                <iframe src="https://giphy.com/embed/elatsjsGzdLtNov4Ky" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/iJhcSIRE8IhJEwWudO" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/loeVS7xSL1o46LxeoK" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/S6kvJjp6iGB6YXMbK4" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/Kg9DmEoDJjhC1gWPHE" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/QCIa3WEcgZCa6YmJT5" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/fUGW4erfIYUJRoZIwZ" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/llUeFDNRaLWvokhbat" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/L2llNi8VK3XgfuDUKR" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/SYoYIr1xwXExnGaQuM" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/U6eTGDLMa0L1FWkL9Z" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/Sql4zgbgJCH2BtdJT8" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/jRwKzj28kaAxbfH5fC" width="100%" className="rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/kyXRKuEYmGhscoz3ki" width="100%" className="rounded" allowFullScreen></iframe>
              </Slider>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
