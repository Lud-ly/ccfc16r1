"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loader from '../../../src/components/Sections/components/Loader';
import ArrowBack from "../../../src/components/Sections/components/ArrowBack";

interface MatchEntity {
    ma_no: number;
    date: string;
    time: string;
    home_score: number;
    away_score: number;
    home: {
        short_name: string;
        club: {
            logo: string;
        };
    };
    away: {
        short_name: string;
        club: {
            logo: string;
        };
    };
    terrain: {
        name: string;
        city: string;
    };
}

interface MatchMembre {
    match_entity: MatchEntity;
    prenom: string;
    nom: string;
    label_position: string;
}

interface MatchData {
    "hydra:member": MatchMembre[];
}

const MatchAVenirPage: React.FC<{ params: { 'match-a-venirId': string } }> = ({ params }) => {
    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api-dofa.prd-aws.fff.fr/api/match_membres?match_entity.ma_no=${params['match-a-venirId']}`
                );
                const data: MatchData = await response.json();
                setMatchData(data);
            } catch (error) {
                console.error('Erreur lors du chargement des détails du match:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchDetails();
    }, [params['match-a-venirId']]);

    if (isLoading) {
        return <Loader />;
    }

    if (!matchData || matchData["hydra:member"].length === 0) {
        return <div><ArrowBack iSize={40} /><p className="text-center">Match non disponible pour l&#39;instant</p></div>;
    }

    const matchMembre = matchData["hydra:member"][0];
    const match = matchMembre.match_entity;

    return (
        <div className="flex flex-col gap-8 p-4">
            <ArrowBack iSize={40} />
            <h1 className="text-2xl font-bold text-center">Détails du Match</h1>
            <p className="text-center">
                {new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} à {match.time}
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex items-center">
                    <Image
                        src={match.home.club.logo}
                        alt={`Logo ${match.home.short_name}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 mr-4"
                    />
                    <span className="truncate text-lg">{match.home.short_name}</span>
                </div>
                <div className="text-4xl font-bold text-blue-500 mx-4">
                    {match.home_score} - {match.away_score}
                </div>
                <div className="flex items-center">
                    <span className="truncate order-2 md:order-1 ml-4 md:ml-0 md:mr-4 text-lg">{match.away.short_name}</span>
                    <Image
                        src={match.away.club.logo}
                        alt={`Logo ${match.away.short_name}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 order-1 md:order-2"
                    />
                </div>
            </div>
            <div className="text-center">
                <p className="font-semibold">Lieu du match</p>
                <p>{match.terrain.name}</p>
                <p>{match.terrain.city}</p>
            </div>
            <div className="text-center">
                <p className="font-semibold">Arbitre</p>
                <p>{matchMembre.prenom} {matchMembre.nom}</p>
                <p>{matchMembre.label_position}</p>
            </div>
        </div>
    );
};

export default MatchAVenirPage;