// pages/api/club-results.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const clubResults = await prisma.clubResult.findMany();
    res.status(200).json(clubResults);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch club results" });
  }
}
