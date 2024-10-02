import Link from "next/link";
import { FaExternalLinkAlt, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4" style={{ backgroundColor: "rgb(9, 87, 159)" }}>
      <div className="flex justify-between items-center">
        {/* Left side - Social media icons */}
        <div className="flex space-x-4">
          <Link
            href="https://www.facebook.com/CastelnauLeCres/?locale=fr_FR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook
              size={24}
              className="text-white hover:text-blue-300 transition-colors"
            />
          </Link>
          <Link
            href="https://www.instagram.com/castelnaulecresfc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              size={24}
              className="text-white hover:text-pink-400 transition-colors"
            />
          </Link>
          <Link
            href="https://www.castelnaulecresfootballclub.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt
              size={22}
              className="text-white hover:text-gray-400 transition-colors"
            />
          </Link>

        </div>

        {/* Right side - Text */}
        <div className="text-right">
          <h6 className="text-xs text-white font-semibold tracking-wide">
            L.M &copy; {currentYear}
          </h6>
          <span className="text-xs text-white">Source : </span>
          <a
            href="https://occitanie.fff.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white ml-1 underline hover:text-blue-500 transition-colors"
          >
            occitanie.fff.fr
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
