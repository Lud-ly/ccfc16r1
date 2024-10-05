"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../../../types/types";
import Image from "next/image";
import Loader from "../components/Loader";
import Link from "next/link";

export default function ProchainMatch() {
    const [nextMatch, setNextMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNextMatch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=1&clNo=23399`
            );
            const data = await response.json();
            const matches = data["hydra:member"];

            // Filtrer les matchs à venir (dont la date est après aujourd'hui)
            const futureMatches = matches.filter((match: Match) => {
                const matchDate = new Date(match.date);
                const today = new Date();
                return matchDate >= today;
            });

            // Trier les matchs par date du plus proche au plus éloigné
            futureMatches.sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // Prendre le premier match futur
            const upcomingMatch = futureMatches[0];
            setNextMatch(upcomingMatch);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération du prochain match:", error);
        }
    };

    useEffect(() => {
        fetchNextMatch();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!nextMatch) {
        return <div>Pas de match trouvé.</div>;
    }

    return (
        <Link href="/matchs" className="block h-screen">
            <div className="w-full bg-white shadow-lg opacity-80 overflow-hidden cursor-pointer rounded">
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <p className="mt-2 w-full md:w-1/4">
                        <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded">
                            {nextMatch.poule_journee.number}ème Journée
                        </span>
                    </p>
                    <p className="text-center mt-2 w-full md:w-1/4">
                        {new Date(nextMatch.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).replace(/^\w/, (c) => c.toUpperCase())}
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center w-full mt-4 md:mt-0 text-bold">
                        <div className="flex flex-col items-center mx-2">
                            <Image
                                src={nextMatch.home.club.logo}
                                alt={`Logo ${nextMatch.home.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                }}
                            />
                            <span className="text-sm font-bold text-gray-800 text-center">
                                {nextMatch.home.short_name}
                            </span>
                        </div>

                        <span className="text-4xl font-bold text-gray-800 mx-4 my-2 md:my-0 text-center">
                            {nextMatch.home_score} - {nextMatch.away_score}
                        </span>

                        <div className="flex flex-col items-center mx-2">
                            <Image
                                src={nextMatch.away.club.logo}
                                alt={`Logo ${nextMatch.away.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                }}
                            />
                            <span className="text-sm font-bold text-gray-800 text-center">
                                {nextMatch.away.short_name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
