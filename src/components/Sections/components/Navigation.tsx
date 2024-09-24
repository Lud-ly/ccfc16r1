import Link from "next/link";
import { useState } from "react";
import {
  FaCalendar,
  FaClipboardList,
  FaHistory,
  FaListAlt,
} from "react-icons/fa";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center p-4">
        <h5 className="font-bold">Saison 2024-2025</h5>
        <button
          className="text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="flex flex-col items-start p-4">
          <Link
            href="/calendrier"
            className="flex items-center py-2 text-gray-700 hover:text-blue-500"
          >
            <FaCalendar className="mr-2" /> Calendrier
          </Link>
          <Link
            href="/dernier-resultat"
            className="flex items-center py-2 text-gray-700 hover:text-blue-500"
          >
            <FaClipboardList className="mr-2" /> Dernier Résultat
          </Link>
          <Link
            href="/a-venir"
            className="flex items-center py-2 text-gray-700 hover:text-blue-500"
          >
            <FaHistory className="mr-2" /> À Venir
          </Link>
          <Link
            href="/tous-les-resultats"
            className="flex items-center py-2 text-gray-700 hover:text-blue-500"
          >
            <FaListAlt className="mr-2" /> Tous les Résultats
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
