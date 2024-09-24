"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Définitions des types
interface ClubData {
  logo: string;
}

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

interface ApiResponse {
  "hydra:member": ClassementJournee[];
}

const ClassementComponent = () => {
  const [classements, setClassements] = useState<ClassementJournee[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchClassements = async () => {
      try {
        const res = await fetch(
          "https://api-dofa.prd-aws.fff.fr/api/compets/420289/phases/1/poules/1/classement_journees"
        );
        const data: ApiResponse = await res.json();
        setClassements(data["hydra:member"]);

        // Obtenir la date de mise à jour la plus récente
        const latestUpdate = data["hydra:member"].reduce((latest, current) => {
          return latest > current.external_updated_at
            ? latest
            : current.external_updated_at;
        }, "");
        setLastUpdated(latestUpdate);

        // Récupérer les logos pour chaque équipe
        const logoPromises = data["hydra:member"].map(async (classement) => {
          const clubId = classement.equipe.club["@id"].split("/").pop();
          try {
            const clubRes = await fetch(
              `https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}`
            );
            const clubData: ClubData = await clubRes.json();
            return { clubId, logo: clubData.logo };
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du logo pour le club ${clubId}:`,
              error
            );
            return { clubId, logo: null };
          }
        });

        const logosData = await Promise.all(logoPromises);
        const logosMap = logosData.reduce((acc, { clubId, logo }) => {
          if (clubId && logo) {
            acc[clubId] = logo;
          }
          return acc;
        }, {} as { [key: string]: string });

        setLogos(logosMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des classements:", error);
      }
    };

    fetchClassements();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTendance = (classement: ClassementJournee) => {
    const { won_games_count, draw_games_count, lost_games_count } = classement;
    if (won_games_count >= 2) {
      return "😊"; // Smiley vert
    } else if (
      lost_games_count >= 2 ||
      (draw_games_count >= 1 && lost_games_count >= 1)
    ) {
      return "😡"; // Smiley rouge
    } else if (draw_games_count >= 2) {
      return "😐"; // Smiley orange
    } else if (
      lost_games_count >= 2 ||
      (draw_games_count >= 1 && won_games_count >= 1)
    ) {
      return "😕"; // Autre cas
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Classement</h1>
        <p className="text-sm text-black mt-2 md:mt-0">
          Mise à jour le : {formatDate(lastUpdated)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Pos</th>
              <th className="p-2 text-left">Club</th>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-right text-blue-800 font-bold text-lg">
                Pts
              </th>
              <th className="p-2 text-right">T</th>
              <th className="p-2 text-right">J</th>
              <th className="p-2 text-right">G</th>
              <th className="p-2 text-right">N</th>
              <th className="p-2 text-right">P</th>
              <th className="p-2 text-right">BP</th>
              <th className="p-2 text-right">BC</th>
              <th className="p-2 text-right">Diff</th>
            </tr>
          </thead>
          <tbody>
            {classements && classements.length > 0 ? (
              classements.map((classement) => {
                const clubId = classement.equipe.club["@id"].split("/").pop();
                return (
                  <tr key={classement["@id"]} className="border-b">
                    <td className="p-2">{classement.rank}</td>
                    <td className="p-2 flex items-center">
                      {clubId && logos[clubId] ? (
                        <Image
                          src={logos[clubId]}
                          alt={`Logo ${classement.equipe.short_name}`}
                          width={30}
                          height={30}
                          className="mr-2"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder-logo.png";
                          }}
                        />
                      ) : (
                        <div className="w-[30px] h-[30px] bg-gray-200 mr-2"></div>
                      )}
                    </td>
                    <td className="p-2">{classement.equipe.short_name}</td>
                    <td className="p-2 text-right text-blue-800 font-bold text-xl">
                      {classement.point_count}
                    </td>
                    <td className="p-2 text-lg text-right">
                      {calculateTendance(classement)}
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
                    <td className="p-2 text-right">{classement.goals_diff}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="p-4 text-left text-gray-600">
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
