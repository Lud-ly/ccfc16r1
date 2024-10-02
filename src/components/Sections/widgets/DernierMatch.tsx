"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../../../types/types";
import Image from "next/image";
import Loader from "../components/Loader";
import Link from "next/link";

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
        <Link href="/classement" className="block h-screen">
            <div className="w-full bg-white shadow-lg opacity-80 overflow-hidden cursor-pointer rounded">
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <p className="text-center mt-2 w-full md:w-1/4"> 
                        {new Date(latestMatch.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).replace(/^\w/, (c) => c.toUpperCase())}
                    </p>
                    <div className="flex items-center justify-center w-full mt-4 md:mt-0 text-bold"> 
                        <div className="flex flex-col items-center mx-2"> 
                          <h2 className="text-2xl font-bold text-gray-800 mx-4">NOUS</h2>
                        </div>

                        <span className="text-4xl font-bold text-gray-800 mx-4">
                            {latestMatch.home_score} - {latestMatch.away_score}
                        </span>

                        <div className="flex flex-col items-center mx-2"> 
                            <Image
                                src={latestMatch.away.club.logo}
                                alt={`Logo ${latestMatch.away.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}