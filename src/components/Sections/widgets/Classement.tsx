"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowUp, FaArrowRight, FaArrowDown } from "react-icons/fa";
import Loader from "../components/Loader";

interface ClassementJournee {
  "@id": string;
  rank: number;
  point_count: number;
  total_games_count: number;
  won_games_count: number;
  draw_games_count: number;
  lost_games_count: number;
  goals_for_count: number;
  goals_against_count: number;
  goals_diff: number;
  equipe: {
    club: {
      "@id": string;
    };
    short_name: string;
  };
  external_updated_at: string;
}

interface ClubResult {
  clubId: string;
  trend: string;
}

const baseUrl = process.env.NODE_ENV === "production" 
  ? "https://ccfc16r1.vercel.app" 
  : "http://localhost:3000";

const ClassementComponent = () => {
  const [classements, setClassements] = useState<ClassementJournee[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<ClubResult[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        // Fetch classements and club results in parallel
        const [classementsRes, resultsRes] = await Promise.all([
          fetch("https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/classement_journees", {
            signal: controller.signal
          }),
          fetch(`${baseUrl}/api/club-results`, {
            signal: controller.signal
          })
        ]);

        const classementsData = await classementsRes.json();
        const resultsData = await resultsRes.json();

        setClassements(classementsData["hydra:member"]);
        setResults(resultsData);

        // Get latest update date
        const latestUpdate = classementsData["hydra:member"].reduce((latest: string, current: ClassementJournee) => {
          return latest > current.external_updated_at ? latest : current.external_updated_at;
        }, "");
        setLastUpdated(latestUpdate);

        // Update database in background
        checkAndUpdateDatabase(latestUpdate, classementsData["hydra:member"]);

        // Fetch logos in batches of 5
        const clubIds = classementsData["hydra:member"].map(
          (c: ClassementJournee) => c.equipe.club["@id"].split("/").pop()
        );
        
        const logosMap: { [key: string]: string } = {};
        const batchSize = 5;
        
        for (let i = 0; i < clubIds.length; i += batchSize) {
          const batch = clubIds.slice(i, i + batchSize);
          const batchPromises = batch.map(async (clubId: any) => {
            try {
              const res = await fetch(
                `https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}`,
                { signal: controller.signal }
              );
              const data = await res.json();
              return { clubId, logo: data.logo };
            } catch (error) {
              console.error(`Error fetching logo for club ${clubId}:`, error);
              return { clubId, logo: null };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(({ clubId, logo }) => {
            if (clubId && logo) logosMap[clubId] = logo;
          });
          
          setLogos(prev => ({ ...prev, ...logosMap }));
        }

      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const checkAndUpdateDatabase = async (latestUpdate: string, classements: ClassementJournee[]) => {
    try {
      const checkRes = await fetch(`${baseUrl}/api/check-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latestUpdate })
      });

      const { shouldUpdate } = await checkRes.json();
      
      if (shouldUpdate) {
        await fetch(`${baseUrl}/api/save-classement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classements })
        });
      }
    } catch (error) {
      console.error("Database update error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) return <Loader />;
  

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold py-5 uppercase">Classement</h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <p className="text-sm text-black mt-2 md:mt-0">
          Mise à jour le : {formatDate(lastUpdated)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Pos</th>
              <th className="p-2 text-left">Club</th>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-center text-blue-900 font-bold text-lg">
                Pts
              </th>
              <th className="p-2 text-right">J</th>
              <th className="p-2 text-right">G</th>
              <th className="p-2 text-right">N</th>
              <th className="p-2 text-right">P</th>
              <th className="p-2 text-right">BP</th>
              <th className="p-2 text-right">BC</th>
              <th className="p-2 text-right">Diff</th>
              <th className="p-2 text-center">T</th>
            </tr>
          </thead>
          <tbody>
            {classements && classements.length > 0 ? (
              classements.map((classement) => {
                const clubId = classement.equipe.club["@id"].split("/").pop();
                const clubResult = results.find(
                  (result) => result.clubId === clubId
                ); // Trouver le résultat du club correspondant
                const trend = clubResult ? clubResult.trend : "neutral"; // Déterminer la tendance

                return (
                  <tr key={classement["@id"]} className="border-b">
                    <td className="p-2">{classement.rank}</td>
                    <td className="p-2 flex items-center">
                      {clubId && logos[clubId] ? (
                        <Image
                          src={logos[clubId]}
                          alt={`Logo ${classement.equipe.short_name}`}
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
                    </td>
                    <td className="p-2">{classement.equipe.short_name}</td>
                    <td className="py-2 text-center text-blue-800 font-bold text-xl">
                      {classement.point_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.total_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.won_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.draw_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.lost_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_for_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_against_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_for_count -
                        classement.goals_against_count}
                    </td>
                    <td className="p-2 text-center">
                      <div className="inline-block p-2 bg-black rounded-full">
                        {trend === "up" && (
                          <FaArrowUp className="text-green-500" />
                        )}
                        {trend === "neutral" && (
                          <FaArrowRight className="text-orange-300" />
                        )}
                        {trend === "down" && (
                          <FaArrowDown className="text-red-500" />
                        )}
                        {trend === "encouraging" && (
                          <FaArrowUp className="text-blue-500" />
                        )}
                        {trend === "concerning" && (
                          <FaArrowDown className="text-purple-500" />
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="p-4 text-left text-gray-600">
                  Pas de données disponibles,
                  <br /> vérifier votre connexion.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassementComponent;
