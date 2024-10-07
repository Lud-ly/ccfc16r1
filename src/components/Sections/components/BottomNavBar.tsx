import Link from 'next/link';
import { FaChartLine, FaCalendarAlt, FaList, FaFutbol, FaGraduationCap, FaHome } from 'react-icons/fa';

const BottomNavBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 shadow-lg rounded-t-3xl"
      style={{
        backgroundColor: "rgba(9, 87, 159, 0.95)",
        padding: "10px 0",
        zIndex: 1000,
      }}
    >
      <div className="flex justify-around items-center p-2">
        {/* Bouton Home */}
        <Link href="/" className="flex flex-col items-center text-white">
          <FaHome className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs mt-1">Home</span>
        </Link>

        {/* Bouton Classement */}
        <Link href="/classement" className="flex flex-col items-center text-white">
          <FaChartLine className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs mt-1">Classement</span>
        </Link>

        {/* Bouton Matchs */}
        <Link href="/matchs" className="flex flex-col items-center text-white">
          <FaCalendarAlt className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs mt-1">Nos matchs</span>
        </Link>

        {/* Bouton Tous les Matchs */}
        <Link href="/tous-les-matchs" className="flex flex-col items-center text-white">
          <FaList className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs mt-1">Tous les Matchs</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
