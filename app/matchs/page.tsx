"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import Loader from '../../src/components/Sections/components/Loader';

interface Match {
  ma_no: number;
  date: string;
  home_score: number;
  away_score: number;
  time: number;
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
}

const MatchsAVenirPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=1&clNo=23399'
        );
        const data = await response.json();
        setMatches(data['hydra:member']);
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold py-10 uppercase">Nos Matchs</h1>
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <Link key={match.ma_no} href={`/matchs/${match.ma_no}`}>
            <div className="border p-4 rounded-md shadow-md cursor-pointer">
              <p className="text-center mt-2">
                {new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} à <span className='text-blue-500'>{match.time}</span>
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center w-1/3">
                  <Image
                    src={match.home.club.logo}
                    alt={`Logo ${match.home.club.logo}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 mr-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/next.svg.png";
                    }}
                  />
                  <span className="truncate">{match.home.short_name}</span>
                </div>
                <div className="text-lg font-bold w-1/3 text-center">
                  {match.home_score} - {match.away_score}
                </div>
                <div className="flex items-center w-1/3 justify-end">
                  <span className="truncate">{match.away.short_name}</span>
                  <Image
                    src={match.away.club.logo}
                    alt={`${match.away.short_name} logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 ml-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/next.svg.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MatchsAVenirPage;