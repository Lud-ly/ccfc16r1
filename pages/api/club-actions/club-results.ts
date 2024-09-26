import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";
import { z } from "zod";

// Define the ClubResult schema using Zod
const ClubResultSchema = z.object({
  clubId: z.string().min(1, "Club ID cannot be empty"),
  clubName: z
    .string()
    .min(1, "Club Name cannot be empty")
    .max(255, "Club Name cannot exceed 255 characters"),
  wonGamesCount: z.number().nonnegative("Won games count cannot be negative"),
  drawGamesCount: z.number().nonnegative("Draw games count cannot be negative"),
  lostGamesCount: z.number().nonnegative("Lost games count cannot be negative"),
  totalGames: z.number().nonnegative("Total games cannot be negative"),
  trend: z.string().min(1, "Trend cannot be empty"),
  goalsConceded: z.number().nonnegative("Goals conceded cannot be negative"),
  goalsScored: z.number().nonnegative("Goals scored cannot be negative"),
});

// Define the response type for the API handler
type ClubResult = z.infer<typeof ClubResultSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClubResult[] | { error: string }>
) {
  if (req.method === "GET") {
    res.setHeader("Allow", ["GET"]);
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

        // Validate the trend data before returning
        const clubResultData = {
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

        // Validate the data using Zod
        ClubResultSchema.parse(clubResultData);

        return clubResultData;
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
