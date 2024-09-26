// pages/api/check-update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { latestUpdate } = req.body;

  // Récupérer la dernière date de mise à jour en base
  const lastUpdate = await prisma.clubResult.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  // Si la date est différente, retourner une réponse indiquant qu'il faut mettre à jour
  if (lastUpdate && lastUpdate.updatedAt !== latestUpdate) {
    return res.json({ shouldUpdate: true });
  } else {
    return res.json({ shouldUpdate: false });
  }
}
