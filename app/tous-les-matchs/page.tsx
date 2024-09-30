"use client";

import React, { useEffect, useState } from "react";
import ArrowBack from "../../src/components/Sections/components/ArrowBack";
import { Match } from "../../types/types";
import Image from "next/image";

export default function TousLesMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMatches = async (page: number) => {
    try {
      const response = await fetch(
        `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`
      );
      const data = await response.json();
      setMatches(data["hydra:member"]);
      setTotalPages(Math.ceil(data["hydra:totalItems"] / 30));

    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    }
  };

  useEffect(() => {
    fetchMatches(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4">
      <ArrowBack iSize={40} />
      <h1 className="text-2xl font-bold my-4">Résultats des Matchs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-200">
              <th className="p-2 text-center">Date</th>
              <th className="p-2 text-center">Match</th>
              <th className="p-2 text-center">Résultat</th>
              <th className="p-2 text-center">Terrain</th>
            </tr>
          </thead>
          <tbody>

            {matches.map((match) => (
              <tr key={match.ma_no} className="border-b">
                <td className="p-2 block sm:table-cell">
                  <div className="flex flex-row justify-around items-center m-2">
                    <span>
                      {new Date(match.date).toLocaleString("fr-FR", {
                        dateStyle: "short",
                      })}
                    </span>
                    <span>-</span>
                    <span>
                      {match.time}
                    </span>
                  </div>
                </td>
                <td className="p-2 block sm:table-cell">
                  <div className="flex flex-row justify-around items-center m-2">
                    {match.home.short_name}
                    <Image
                      src={match.home.club.logo}
                      alt={`Logo ${match.home.club.logo}`}
                      width={40}
                      height={40}
                      className="w-8 h-8 m-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/next.svg.png";
                      }}
                    />
                    vs
                    <Image
                      src={match.away.club.logo}
                      alt={`Logo ${match.away.short_name}`}
                      width={40}
                      height={40}
                      className="w-8 h-8 m-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/next.svg.png";
                      }}
                    />
                    {match.away.short_name}
                  </div>
                </td>
                <td className="p-2 font-semibold block sm:table-cell">
                  <div className="flex flex-row justify-around items-center m-2">
                    {match.home_score !== null && match.away_score !== null
                      ? <h2 className="text-lg sm:text-2xl font-bold">
                        {match.home_score} - {match.away_score}</h2>
                      : "⏳"}
                  </div>
                </td>
                <td className="p-2 block sm:table-cell">
                  <div className="flex flex-row  justify-center items-center m-2">
                    {match.terrain.name}, {match.terrain.city}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center my-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-center">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}