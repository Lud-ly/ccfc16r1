"use client";

import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from "chart.js";
import Loader from "../components/Loader";
import { ClubData, Match } from "~/types/types";
import Image from "next/image"; // Import du composant Image

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const GraphComponent: React.FC = () => {
    const [logos, setLogos] = useState<{ [key: string]: string }>({}); // Changer ici le type de logos
    const [results, setResults] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartType, setChartType] = useState<"line" | "bar">("line");
    const [activeClub, setActiveClub] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatchResults = async (page: number = 1) => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`
                );
                const data = await response.json();

                const clubIds = new Set<number>();
                data["hydra:member"].forEach((match: Match) => {
                    clubIds.add(match.home.club.cl_no);
                    clubIds.add(match.away.club.cl_no);
                });

                const logoPromises = Array.from(clubIds).map(clubId => fetchClubLogo(clubId));
                const logosData = await Promise.all(logoPromises);
                const logosMap = logosData.reduce((acc, { clubId, logo }) => {
                    if (clubId && logo) {
                        acc[clubId] = logo; // Conserver l'accès avec le clubId ici
                    }
                    return acc;
                }, {} as { [key: number]: string });

                setLogos(logosMap);
                setResults(data["hydra:member"].sort((a: Match, b: Match) => a.poule_journee.number - b.poule_journee.number));
            } catch (error) {
                console.error("Erreur lors de la récupération des résultats de match:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchResults();
    }, []);

    const fetchClubLogo = async (clubId: number) => {
        try {
            const clubRes = await fetch(`https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}`);
            const clubData: ClubData = await clubRes.json();
            return { clubId, logo: clubData.logo };
        } catch (error) {
            console.error(`Erreur lors de la récupération du logo pour le club ${clubId}:`, error);
            return { clubId, logo: null };
        }
    };

    const calculatePoints = (match: Match, clubName: string): number | null => {
        if (match.home_score === null || match.away_score === null) return null;
        const isHome = match.home.short_name === clubName;
        const score = isHome ? match.home_score - match.away_score : match.away_score - match.home_score;
        return score > 0 ? 3 : score === 0 ? 1 : 0;
    };

    const generateChartDataForClub = (clubName: string, matches: Match[]): ChartData<'line'> => {
        const pointsData: (number | null)[] = [];
        const labels: string[] = [];
        let cumulativePoints = 0;

        const filteredMatches = matches.filter(match =>
            match.home.short_name === clubName || match.away.short_name === clubName
        );

        filteredMatches.forEach((match) => {
            const matchDay = match.poule_journee.number;
            labels.push(`J${matchDay}`);

            const points = calculatePoints(match, clubName);
            if (points !== null) {
                cumulativePoints += points;
                pointsData.push(cumulativePoints);
            } else {
                pointsData.push(null);
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: "Points cumulés",
                    data: pointsData,
                    borderColor: "rgba(56, 189, 248, 1)",
                    backgroundColor: "rgba(56, 189, 248, 0.2)",
                    fill: false,
                    spanGaps: true,
                },
            ],
        };
    };

    const generateBarChartDataForClub = (clubName: string, matches: Match[]): ChartData<'bar'> => {
        const labels: string[] = [];
        const goalsForData: (number | null)[] = [];
        const goalsAgainstData: (number | null)[] = [];

        const filteredMatches = matches.filter(match =>
            match.home.short_name === clubName || match.away.short_name === clubName
        );

        filteredMatches.forEach((match) => {
            const matchDay = match.poule_journee.number;
            labels.push(`J${matchDay}`);
            const isHome = match.home.short_name === clubName;
            goalsForData.push(isHome ? match.home_score : match.away_score);
            goalsAgainstData.push(isHome ? match.away_score : match.home_score);
        });

        return {
            labels,
            datasets: [
                {
                    label: "Buts marqués",
                    data: goalsForData,
                    backgroundColor: "rgba(34, 197, 94, 1)",
                },
                {
                    label: "Buts encaissés",
                    data: goalsAgainstData,
                    backgroundColor: "rgba(239, 68, 68, 1)",
                },
            ],
        };
    };

    const commonOptions: ChartOptions<'line' | 'bar'> = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
            y1: {
                beginAtZero: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const sortClubs = (matches: Match[], type: 'attack' | 'defense') => {
        const clubStats: {
            [key: string]: {
                goalsFor: number;
                goalsAgainst: number;
                clubId: number;
            }
        } = {};

        matches.forEach(match => {
            const homeTeam = match.home.short_name;
            const awayTeam = match.away.short_name;
            const homeTeamId = match.home.club.cl_no;
            const awayTeamId = match.away.club.cl_no;

            if (!clubStats[homeTeam]) {
                clubStats[homeTeam] = {
                    goalsFor: 0,
                    goalsAgainst: 0,
                    clubId: homeTeamId
                };
            }
            if (!clubStats[awayTeam]) {
                clubStats[awayTeam] = {
                    goalsFor: 0,
                    goalsAgainst: 0,
                    clubId: awayTeamId
                };
            }

            clubStats[homeTeam].goalsFor += match.home_score || 0;
            clubStats[homeTeam].goalsAgainst += match.away_score || 0;
            clubStats[awayTeam].goalsFor += match.away_score || 0;
            clubStats[awayTeam].goalsAgainst += match.home_score || 0;
        });

        const sortedClubs = Object.entries(clubStats)
            .map(([club, stats]) => ({
                club,
                ...stats,
                points: stats.goalsFor - stats.goalsAgainst,
            }))
            .sort((a, b) => type === 'attack' ? b.goalsFor - a.goalsFor : a.goalsAgainst - b.goalsAgainst);

        return sortedClubs;
    };


    const bestAttackers = sortClubs(results, 'attack');
    const bestDefenders = sortClubs(results, 'defense');

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Statistiques des Clubs</h1>
                <div>
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as "line" | "bar")}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="line">Graphique en Ligne</option>
                        <option value="bar">Graphique à Barres</option>
                    </select>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Meilleures Attaques</h2>
                    <ul className="space-y-2">
  {bestAttackers.map(({ club, goalsFor }, index) => (
    <li key={index} className="flex flex-col items-start hover:bg-gray-100 p-4 rounded-lg border border-gray-300">
      <div className="flex items-center space-x-4">
        {club && logos[club] ? (
          <Image
            src={logos[club]}
            alt={`Logo ${club}`}
            width={32}
            height={32}
            className="mr-2 w-auto h-auto"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-image.png"; // Fallback image
            }}
            unoptimized // Désactive l'optimisation pour les URLs dynamiques
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 flex-shrink-0"></div> // Placeholder si le logo n'existe pas
        )}
        <button
          onClick={() => setActiveClub(activeClub === club ? null : club)}
          className="text-left flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {club} - Buts marqués: {goalsFor}
        </button>
      </div>
      {activeClub === club && (
        <div className="w-full mt-4">
          {chartType === "line" ? (
            <Line data={generateChartDataForClub(club, results)} options={commonOptions} />
          ) : (
            <Bar data={generateBarChartDataForClub(club, results)} options={commonOptions} />
          )}
        </div>
      )}
    </li>
  ))}
</ul>


                    <h2 className="text-xl font-semibold mb-4">Meilleures Défenses</h2>
                    <ul className="space-y-2">
                        {bestDefenders.map(({ club, goalsAgainst }, index) => (
                            <li key={index} className="flex flex-col items-start">
                                <div className="flex items-center">
                                    {club && logos[club] ? ( // Vérifier que le logo est disponible
                                        <Image
                                            src={logos[club]}
                                            alt={`Logo ${club}`}
                                            width={32}
                                            height={32}
                                            className="mr-2 w-auto h-auto"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/next.svg.png"; // Fallback en cas d'erreur
                                            }}
                                            unoptimized // Désactive les optimisations pour éviter les erreurs avec les URLs dynamiques
                                        />
                                    ) : (
                                        <div className="w-[32px] h-[32px] bg-gray-200 mr-2"></div>
                                    )}
                                    <button
                                        onClick={() => setActiveClub(activeClub === club ? null : club)}
                                        className="text-left flex-1 bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        {club} - Buts encaissés: {goalsAgainst}
                                    </button>
                                </div>
                                {activeClub === club && (
                                    <div className="w-full mt-4">
                                        {chartType === "line" ? (
                                            <Line data={generateChartDataForClub(club, results)} options={commonOptions} />
                                        ) : (
                                            <Bar data={generateBarChartDataForClub(club, results)} options={commonOptions} />
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GraphComponent;
