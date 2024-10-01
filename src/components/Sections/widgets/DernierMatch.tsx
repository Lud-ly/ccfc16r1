"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../../../types/types";
import Image from "next/image";
import Loader from "../components/Loader";

export default function DernierMatch() {
    const [latestMatch, setLatestMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLatestMatch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=1&clNo=23399`
            );
            const data = await response.json();
            const matches = data["hydra:member"];

            // Filtrer les matchs dont la date est passée
            const pastMatches = matches.filter((match: Match) => {
                const matchDate = new Date(match.date);
                const today = new Date();
                return matchDate < today;
            });

            // Trier les matchs du plus récent au plus ancien
            pastMatches.sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Prendre le dernier match
            const lastMatch = pastMatches[0];
            setLatestMatch(lastMatch);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération du dernier match:", error);
        }
    };

    useEffect(() => {
        fetchLatestMatch();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!latestMatch) {
        return <div>Pas de match trouvé.</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:max-w-2xl p-3">
            <div className="md:flex">
                <div className="w-full p-4">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Dernier Résultat</h1>
                    <div className="flex flex-col md:flex-row justify-center items-center mt-4">
                        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
                            <Image
                                src={latestMatch.home.club.logo}
                                alt={`Logo ${latestMatch.home.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/next.svg.png";
                                }}
                            />
                        </div>

                        <div className="my-4 md:my-0 text-center">
                            <span className="text-4xl font-bold text-gray-800">
                                {latestMatch.home_score} - {latestMatch.away_score}
                            </span>
                        </div>

                        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
                            <Image
                                src={latestMatch.away.club.logo}
                                alt={`Logo ${latestMatch.away.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/next.svg.png";
                                }}
                            />
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            Terrain : <span>{latestMatch.terrain.name}, {latestMatch.terrain.city}</span>
                        </p>
                        <p className="text-center mt-2">
                            {new Date(latestMatch.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} à <span className='text-blue-500'>{latestMatch.time}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
}