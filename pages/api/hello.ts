// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";

type Data = {
  name: string;
  id: number;
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  goalsScored: number;
  goalsConceded: number;
  updatedAt: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { message: string }>
) {
  try {
    const results = await prisma.clubResult.findMany();

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No club results found" });
    }

    // Transform the results to match the response type
    const transformedResults = results.map((result) => ({
      name: result.clubName || "Unknown",
      id: result.id,
      clubId: result.clubId,
      clubName: result.clubName || "Unknown",
      wonGamesCount: result.wonGamesCount,
      drawGamesCount: result.drawGamesCount,
      lostGamesCount: result.lostGamesCount,
      goalsScored: result.goalsScored,
      goalsConceded: result.goalsConceded,
      updatedAt: result.updatedAt,
    }));

    res.status(200).json(transformedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
