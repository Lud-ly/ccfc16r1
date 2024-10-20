import Link from 'next/link';
import { FaChartLine, FaCalendarAlt, FaList, FaFutbol, FaGraduationCap, FaHome, FaTrophy } from 'react-icons/fa';

const BottomNavBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 shadow-lg rounded-t-3xl"
      style={{
        backgroundColor: "rgba(9, 87, 159, 0.95)",
        padding: "2px 0",
        zIndex: 1000,
      }}
    >
      <div className="flex justify-around items-center p-2">
        {/* Bouton Classement */}
        <Link href="/" className="flex flex-col items-center text-white">
          <FaTrophy className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs">Classement</span>
        </Link>

        {/* Bouton Matchs */}
        <Link href="/matchs" className="flex flex-col items-center text-white">
          <FaCalendarAlt className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs">Nos matchs</span>
        </Link>

        {/* Bouton Tous les Matchs */}
        <Link href="/tous-les-matchs" className="flex flex-col items-center text-white">
          <FaList className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs">Tous les Matchs</span>
        </Link>

        {/* Bouton Stats */}
        <Link href="/stats" className="flex flex-col items-center text-white">
          <FaChartLine className="text-[30px] sm:text-[34px]" />
          <span className="text-[8px] sm:text-xs">Stats</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
