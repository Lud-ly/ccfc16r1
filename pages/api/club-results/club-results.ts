import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.setHeader("Allow", ["GET"]);
    try {
      const results = await prisma.clubResult.findMany();

      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching club results:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch club results",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
