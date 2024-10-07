import Link from 'next/link';
import { FaChartLine, FaCalendarAlt, FaList, FaFutbol, FaGraduationCap, FaHome } from 'react-icons/fa';

const BottomNavBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 shadow-lg rounded-t-3xl"
      style={{
        backgroundColor: "rgba(9, 87, 159, 0.95)",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div className="flex justify-between items-center p-2">
         {/* Bouton Home */}
         <Link href="/" className="flex flex-col items-center text-white">
          <FaHome size={34} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Bouton Classement */}
        <Link href="/classement" className="flex flex-col items-center text-white">
          <FaChartLine size={34} />
          <span className="text-xs mt-1">Classement</span>
        </Link>

        {/* Bouton Matchs */}
        <Link href="/matchs" className="flex flex-col items-center text-white">
          <FaCalendarAlt size={34} />
          <span className="text-xs mt-1">Nos matchs</span>
        </Link>

        {/* Bouton Tous les Matchs */}
        <Link href="/tous-les-matchs" className="flex flex-col items-center text-white">
          <FaList size={34} />
          <span className="text-xs mt-1">Tous les Matchs</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
