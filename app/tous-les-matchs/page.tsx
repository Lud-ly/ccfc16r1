"use client";

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ArrowBack from "../../src/components/Sections/components/ArrowBack";
import { Match } from "../../types/types";
import Image from "next/image";
import Pagination from "../../src/components/Sections/components/Pagination";
import Loader from "../../src/components/Sections/components/Loader";

export default function TousLesMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`
      );
      const data = await response.json();
      setMatches(data["hydra:member"]);
      setTotalPages(Math.ceil(data["hydra:totalItems"] / 30));
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    }
  };

  useEffect(() => {
    fetchMatches(currentPage);
  }, [currentPage]);

  // Handler pour la pagination
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Groupement des matchs par journée
  const groupedMatches = matches.reduce((acc: Record<number, Match[]>, match) => {
    const journeeNumber = match.poule_journee.number;
    if (!acc[journeeNumber]) {
      acc[journeeNumber] = [];
    }
    acc[journeeNumber].push(match);
    return acc;
  }, {});


  const getSuffix = (number: number) => {
    if (number === 1) return "ère"; // Exception pour 1ère
    return "ème";
  };

  if (isLoading) {
    return  <Loader />;
  }

  return (
    <div className="container mx-auto px-4">
      <ArrowBack iSize={40} />
      <h1 className="text-2xl font-bold my-4 text-center">Résultats des Matchs</h1>

      {/* Table des résultats */}
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
            {Object.entries(groupedMatches).map(([journeeNumber, matches]) => (
              <React.Fragment key={journeeNumber}>
                <tr>
                  <td colSpan={4} className="text-center text-blue-500 font-bold text- p-5">
                    {journeeNumber}
                    <sup>{getSuffix(Number(journeeNumber))}</sup>  Journée
                  </td>
                </tr>

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
                        <span>{match.time}</span>
                      </div>
                    </td>
                    <td className="p-2 block sm:table-cell">
                      <div className="flex flex-row justify-around items-center m-2">
                        <span className="w-32 text-center truncate">{match.home.short_name}</span>
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
                        <span className="w-32 text-center truncate">{match.away.short_name}</span>
                      </div>
                    </td>
                    <td className="p-2 font-semibold block sm:table-cell">
                      <div className="flex flex-row justify-center items-center m-2">
                        {match.home_score !== null && match.away_score !== null ? (
                          <h2 className="text-4xl sm:text-3xl lg:text-2xl font-bold lg:font-semibold text-blue-55x">
                            {match.home_score} - {match.away_score}
                          </h2>
                        ) : (
                          <span className="text-3xl sm:text-2xl lg:text-xl font-semibold text-gray-500">⏳</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 block sm:table-cell">
                      <div className="flex flex-row justify-center items-center m-2">
                        {match.terrain.name}, {match.terrain.city}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pageCount={totalPages} onPageChange={handlePageClick} />
    </div>
  );
}
