"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import Loader from "../components/Loader";
import Image from "next/image"; // Assurez-vous d'importer le composant Image de Next.js
import { ClubData } from "~/types/types";

// Enregistrer les scales et autres éléments nécessaires
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export interface Match {
    home: {
        club: {
            cl_no: number;
            logo: string;
        };
        short_name: string; // Nom abrégé de l'équipe à domicile
    };
    away: {
        club: {
            cl_no: number;
            logo: string;
        };
        short_name: string; // Nom abrégé de l'équipe à l'extérieur
    };
    home_score: number | null; // Score de l'équipe à domicile
    away_score: number | null; // Score de l'équipe extérieure
    poule_journee: {
        number: number; // Numéro de la journée
    };
}

const GraphComponent = () => {
    const [logos, setLogos] = useState<{ [key: number]: string }>({});
    const [results, setResults] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatchResults = async (page: number = 1) => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`
                );
                const data = await response.json();

                // Récupérer tous les clubs uniques
                const clubIds = new Set<number>();

                data["hydra:member"].forEach((match: Match) => {
                    clubIds.add(match.home.club.cl_no);
                    clubIds.add(match.away.club.cl_no);
                });

                // Récupérer les logos pour chaque club
                const logoPromises = Array.from(clubIds).map(clubId => fetchClubLogo(clubId));
                const logosData = await Promise.all(logoPromises);
                const logosMap = logosData.reduce((acc, { clubId, logo }) => {
                    if (clubId && logo) {
                        acc[clubId] = logo; // Mappage correct des logos aux clubs
                    }
                    return acc;
                }, {} as { [key: number]: string });

                setLogos(logosMap);
                setResults(data["hydra:member"]); // Récupérer les matchs
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
            return { clubId, logo: clubData.logo }; // Récupération du logo
        } catch (error) {
            console.error(`Erreur lors de la récupération du logo pour le club ${clubId}:`, error);
            return { clubId, logo: null }; // Retour d'un logo nul en cas d'erreur
        }
    };

    const generateChartDataForClub = (clubName: string, matches: Match[]) => {
        const cumulativeData: number[] = [];
        const labels: string[] = [];
        let cumulativeScore = 0;

        const filteredMatches = matches.filter(match =>
            match.home.short_name === clubName || match.away.short_name === clubName
        );

        // Boucle pour générer les données cumulées
        filteredMatches.forEach(match => {
            if (match.home_score !== null && match.away_score !== null) {
                const matchDay = match.poule_journee.number;
                if (!labels.includes(`Journée ${matchDay}`)) {
                    labels.push(`Journée ${matchDay}`);
                }

                if (match.home.short_name === clubName) {
                    cumulativeScore += match.home_score > match.away_score ? 1 : -1;
                } else {
                    cumulativeScore += match.away_score > match.home_score ? 1 : -1;
                }
                cumulativeData.push(cumulativeScore);
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: clubName,
                    data: cumulativeData,
                    borderColor: "rgba(56, 189, 248, 1)",
                    backgroundColor: "rgba(56, 189, 248, 0.2)",
                    fill: true,
                },
            ],
        };
    };

    if (isLoading) return <Loader />;

    const commonOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: '#374151',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Évolution des Performances",
                    color: '#374151',
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Journées",
                    color: '#374151',
                },
            },
        },
    };

    const clubNames = Array.from(new Set(results.flatMap(match => [
        match.home.short_name,
        match.away.short_name
    ])));

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {clubNames.length > 0 ? (
                    clubNames.map((clubName) => {
                        // Trouver le club ID correspondant
                        const match = results.find(match => 
                            match.home.short_name === clubName || match.away.short_name === clubName
                        );

                        // Assurez-vous d'obtenir le bon clubId
                        const clubId = match?.home.short_name === clubName ? match.home.club.cl_no : match?.away.club.cl_no;

                        return (
                            <div
                                key={clubName}
                                className="bg-white shadow-lg rounded-lg p-6 h-[400px] transition-transform transform hover:scale-105"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    {clubId && logos[clubId] ? ( // Vérifier que le logo est disponible
                                        <Image
                                            src={logos[clubId]}
                                            alt={`Logo ${clubName}`}
                                            width={40}
                                            height={40}
                                            className="mr-2 w-auto h-auto"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/next.svg.png";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[30px] h-[30px] bg-gray-200 mr-2"></div>
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                                        {clubName}
                                    </h2>
                                </div>
                                <div className="h-full overflow-x-auto">
                                    <Line
                                        data={generateChartDataForClub(clubName, results)}
                                        options={{
                                            ...commonOptions,
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-700">Aucun club trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default GraphComponent;
