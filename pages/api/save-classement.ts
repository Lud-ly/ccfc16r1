import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/db/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { classements } = req.body;

    if (!classements || classements.length === 0) {
      return res.status(400).json({ error: 'No classements provided' });
    }

    try {
      for (const classement of classements) {
        const clubId = classement.equipe.club["@id"].split("/").pop();
        const clubName = classement.equipe.short_name;
        const wonGamesCount = classement.won_games_count;
        const drawGamesCount = classement.draw_games_count;
        const lostGamesCount = classement.lost_games_count;
        const goalsScored = classement.goals_for_count;
        const goalsConceded = classement.goals_against_count;

        await prisma.clubResult.upsert({
          where: { clubName: clubName },
          update: {
            clubId,
            wonGamesCount,
            drawGamesCount,
            lostGamesCount,
            goalsScored,
            goalsConceded,
          },
          create: {
            clubId,
            clubName,
            wonGamesCount,
            drawGamesCount,
            lostGamesCount,
            goalsScored,
            goalsConceded,
          },
        });
      }

      res.status(200).json({ message: 'Classements saved successfully' });
    } catch (error) {
      console.error('Error saving classements:', error);
      res.status(500).json({ error: 'Error saving classements' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}