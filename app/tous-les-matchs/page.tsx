"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../types/types";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import Loader from "../../src/components/Sections/components/Loader";
import { FaSync } from "react-icons/fa";

export default function TousLesMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJournee, setSelectedJournee] = useState<number | null>(null);

  const fetchMatches = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`
      );
      const data = await response.json();
      const fetchedMatches = data["hydra:member"];
      setMatches(fetchedMatches);
      setTotalPages(Math.ceil(data["hydra:totalItems"] / 30));

      // Logique pour sélectionner la première journée avec un match à venir
      const today = new Date();
      const upcomingMatch = fetchedMatches.find(
        (match: Match) => new Date(match.date) >= today
      );
      if (upcomingMatch) {
        setSelectedJournee(upcomingMatch.poule_journee.number);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    }
  };

  useEffect(() => {
    fetchMatches(currentPage);
  }, [currentPage]);

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
    if (number === 1) return "ère";
    return "ème";
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-1">
      <h1 className="text-2xl font-bold py-5 text-center uppercase">Tous les Matchs</h1>

      {/* Ajouter des boutons pour chaque journée */}
      <div className="mb-4 text-center flex flex-wrap justify-center">
        {Object.keys(groupedMatches).map((journeeNumber) => (
          <button
            key={journeeNumber}
            className={`mx-1 my-1 px-4 py-2 rounded transition duration-200 ease-in-out 
              ${selectedJournee === Number(journeeNumber) ? "bg-yellow-500" : "bg-blue-500"} 
              text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            onClick={() => setSelectedJournee(selectedJournee === Number(journeeNumber) ? null : Number(journeeNumber))} // Toggle pour sélectionner/désélectionner la journée
          >
            {journeeNumber}{getSuffix(Number(journeeNumber))} jour.
          </button>
        ))}
        <button
          className="mx-1 my-1 bg-gray-300 text-black px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setSelectedJournee(null)}
        >
          <FaSync />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="hidden md:table-header-group p-2">
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
                {selectedJournee === Number(journeeNumber) && (
                  <>
                    <tr className="bg-yellow-100">
                      <td colSpan={4} className="text-center text-blue-500 font-bold bg-yellow-500 text-2xl p-5">
                        {journeeNumber}
                        <sup>{getSuffix(Number(journeeNumber))}</sup> Journée
                      </td>
                    </tr>
                    {matches.map((match) => (
                      <tr key={match.ma_no} className="border-b-2 border-gray-700 bg-white my-4">
                        <td className="p-2 block sm:table-cell">
                          <div className="flex flex-row justify-around items-center m-2">
                            <span className="text-gray-500">
                              {new Date(match.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }).replace(/^\w/, (c) => c.toUpperCase())}{" "}
                              à <span className="text-blue-500">{match.time}</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-2 block sm:table-cell">
                          <div className="flex flex-row justify-around items-center m-2">
                            <Image
                              src={match.home.club.logo}
                              alt={`Logo ${match.home.club.logo}`}
                              width={40}
                              height={40}
                              className="w-8 h-8 m-2"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/next.svg.png";
                              }}
                            />
                            <span className="w-32 text-center font-bold">{match.home.short_name}</span>
                            <span className="text-blue-500 text-sm mx-2">vs</span>
                            <span className="w-32 text-center font-bold">{match.away.short_name}</span>
                            <Image
                              src={match.away.club.logo}
                              alt={`Logo ${match.away.short_name}`}
                              width={40}
                              height={40}
                              className="w-8 h-8 m-2"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/next.svg.png";
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-2 font-semibold block sm:table-cell">
                          <div className="flex flex-row justify-around items-center m-2">
                            {match.home_score !== null && match.away_score !== null ? (
                              <h2 className="text-lg sm:text-2xl font-bold">
                                {match.home_score} - {match.away_score}
                              </h2>
                            ) : (
                              <h2 className="text-lg sm:text-2xl font-bold">⏳</h2>
                            )}
                          </div>
                        </td>
                        <td className="p-2 block sm:table-cell">
                          <div className="flex flex-row justify-center items-center m-2">
                            <span className="text-gray-500 text-sm">
                              {match.terrain.name}, {match.terrain.city}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-4 text-center">
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          }
          nextLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          }
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="pagination flex justify-center list-none p-0"
          pageClassName="pagination__link mx-1 px-4 py-2 border border-blue-500 text-blue-500 cursor-pointer"
          activeClassName="pagination__link--active bg-blue-500 text-white"
          previousClassName="pagination__link px-4 py-2 border border-blue-500 text-blue-500 cursor-pointer"
          nextClassName="pagination__link px-4 py-2 border border-blue-500 text-blue-500 cursor-pointer"
          disabledClassName="pagination__link--disabled text-gray-400 cursor-not-allowed"
          forcePage={currentPage - 1}
        />
      </div>
    </div>
  );
}
