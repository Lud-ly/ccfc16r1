import React from "react";
import Image from "next/image";

// Fonction pour calculer la tendance des résultats
const getTendanceSmiley = (recentResults: any[]) => {
  const lastTwoResults = recentResults.slice(-2).join("");

  if (lastTwoResults === "VV") {
    // 2 victoires d'affilée => Smiley vert
    return "🟢";
  } else if (
    lastTwoResults === "DD" ||
    lastTwoResults === "DN" ||
    lastTwoResults === "ND"
  ) {
    // 2 défaites ou une défaite + un nul => Smiley rouge
    return "🔴";
  } else if (lastTwoResults === "VD" || lastTwoResults === "DV") {
    // Une victoire + une défaite => Smiley rouge
    return "🔴";
  } else if (
    lastTwoResults === "NN" ||
    lastTwoResults === "ND" ||
    lastTwoResults === "DN" ||
    lastTwoResults === "VN"
  ) {
    // 2 nuls d'affilée ou nul + défaite ou victoire + nul => Smiley orange
    return "🟠";
  }
  return "⚪"; // Default, pas de tendance particulière
};

// Exemple de résultats des clubs
const clubResults = [
  { clubName: "Club A", recentResults: ["V", "V", "D", "V", "V"] }, // 2 victoires d'affilée -> 🟢
  { clubName: "Club B", recentResults: ["D", "N", "V", "D", "N"] }, // défaite + nul -> 🟠
  { clubName: "Club C", recentResults: ["N", "D", "D", "N", "D"] }, // 2 défaites d'affilée -> 🔴
  { clubName: "Club D", recentResults: ["V", "V", "N", "V", "N"] }, // victoire + nul -> 🟠
  { clubName: "Club E", recentResults: ["V", "D", "V", "D", "V"] }, // victoire + défaite -> 🔴
];

// Composant pour afficher le classement avec tendances
const Tendances = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classement 2024-2025</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Pos</th>
            <th className="p-2 text-left">Club</th>
            <th className="p-2 text-left">Tendance</th>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-right text-blue-800 font-bold text-lg">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {clubResults.map((club, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{club.clubName}</td>
              <td className="p-2 text-lg">
                {getTendanceSmiley(club.recentResults)}
              </td>
              <td className="p-2">{club.clubName}</td>
              <td className="p-2 text-right text-blue-800 font-bold text-xl">
                {/* Remplace par les vrais points */}
                {Math.floor(Math.random() * 100)} {/* Exemple de points */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tendances;
