import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";

interface ClubResult {
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  totalGames: number;
  trend: string; // Tendance
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClubResult[] | { error: string }>
) {
  if (req.method === "GET") {
    try {
      const results = await prisma.clubResult.findMany();
      const trends: ClubResult[] = results.map((result) => {
        const totalGames =
          result.wonGamesCount + result.drawGamesCount + result.lostGamesCount;
        const goalsConceded = result.goalsConceded;
        const goalsScored = result.goalsScored;
        // Logique de tendance
        let trend = "";

        if (result.wonGamesCount > result.lostGamesCount) {
          trend = "up";
        } else if (result.lostGamesCount > result.wonGamesCount) {
          trend = "down";
        } else if (
          result.wonGamesCount === result.lostGamesCount ||
          result.drawGamesCount > 0
        ) {
          trend = "neutral";
        }

        return {
          clubId: result.clubId,
          clubName: result.clubName,
          wonGamesCount: result.wonGamesCount,
          drawGamesCount: result.drawGamesCount,
          lostGamesCount: result.lostGamesCount,
          totalGames,
          goalsConceded,
          goalsScored,
          trend,
        };
      });

      res.status(200).json(trends);
    } catch (error) {
      console.error("Error fetching club results:", error);
      res.status(500).json({ error: "Failed to fetch club results" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
