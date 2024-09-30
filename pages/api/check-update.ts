// pages/api/check-update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../src/db/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Vérifie si la méthode de la requête est POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]); // Indique les méthodes autorisées
    return res
      .status(405)
      .json({ message: `Méthode ${req.method} non autorisée` });
  }

  const { latestUpdate } = req.body;

  // Vérifie que la propriété latestUpdate est présente
  if (!latestUpdate) {
    return res
      .status(400)
      .json({ message: "La date de mise à jour est requise." });
  }

  try {
    // Récupérer la dernière date de mise à jour en base
    const lastUpdate = await prisma.clubResult.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    // Si la date est différente, retourner une réponse indiquant qu'il faut mettre à jour
    if (lastUpdate && lastUpdate.updatedAt.toISOString() !== latestUpdate) {
      return res.json({ shouldUpdate: true });
    } else {
      return res.json({ shouldUpdate: false });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la mise à jour :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
}
