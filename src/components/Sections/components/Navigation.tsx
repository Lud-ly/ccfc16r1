import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaCalendar,
  FaBars, FaTimes,
  FaHistory,
  FaListAlt,
} from "react-icons/fa";

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

  return (
    <nav className="shadow-md">
      <div className="flex justify-between items-center p-4">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          id="popup"
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg p-4 w-4/5 sm:w-1/3">
            <div className="home flex flex-row justify-center items-center m-2">
              <Image
                src="/images/logo.png"
                alt="logo ccfc"
                width={50}
                height={50}
                priority
              />
            </div>
            <div className="flex flex-col items-center p-4"></div>
            <Link
              href="/classement"
              className="flex items-center py-2 text-black hover:text-blue-500"
              onClick={handleLinkClick}
            >
              <FaHistory className="mr-2" /> Classement
            </Link>
            <Link
              href="/matchs-a-venir"
              className="flex items-center py-2 text-black hover:text-blue-500"
              onClick={handleLinkClick}
            >
              <FaCalendar className="mr-2" /> Match à venir
            </Link>
            <Link
              href="/tous-les-matchs"
              className="flex items-center py-2 text-black hover:text-blue-500"
              onClick={handleLinkClick}
            >
              <FaListAlt className="mr-2" /> Tous les Matchs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
