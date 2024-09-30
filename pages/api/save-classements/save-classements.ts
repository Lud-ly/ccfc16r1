// pages/api/save-classements.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/src/db/prisma";
import { z } from "zod";

// Define the schema for the classement items using Zod
const ClassementItemSchema = z.object({
  equipe: z.object({
    club: z.object({
      "@id": z.string().min(1, "Club ID is required"), // Ensure club ID is a non-empty string
    }),
    short_name: z.string().min(1, "Short name is required"),
  }),
  won_games_count: z.number().nonnegative("Won games count cannot be negative"),
  draw_games_count: z
    .number()
    .nonnegative("Draw games count cannot be negative"),
  lost_games_count: z
    .number()
    .nonnegative("Lost games count cannot be negative"),
  goals_for_count: z.number().nonnegative("Goals scored cannot be negative"),
  goals_against_count: z
    .number()
    .nonnegative("Goals conceded cannot be negative"),
});

// Define the schema for the request body
const SaveClassementsSchema = z.object({
  classements: z
    .array(ClassementItemSchema)
    .nonempty("At least one classement is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Validate the request body against the schema
      const { classements } = SaveClassementsSchema.parse(req.body);

      for (const classement of classements) {
        const clubId = classement.equipe.club["@id"].split("/").pop() as string; // Cast to string
        if (!clubId) {
          return res
            .status(400)
            .json({ error: "Club ID could not be determined" });
        }

        const clubName = classement.equipe.short_name; // Short name of the club
        const wonGamesCount = classement.won_games_count; // Number of won games
        const drawGamesCount = classement.draw_games_count; // Number of drawn games
        const lostGamesCount = classement.lost_games_count; // Number of lost games
        const goalsScored = classement.goals_for_count; // Number of goals scored
        const goalsConceded = classement.goals_against_count; // Number of goals conceded

        // Check if a result already exists for this club
        const existingClubResult = await prisma.clubResult.findFirst({
          where: {
            clubName: clubName,
          },
        });

        if (existingClubResult) {
          // Update club data
          await prisma.clubResult.update({
            where: {
              id: existingClubResult.id,
            },
            data: {
              clubId,
              clubName,
              wonGamesCount,
              drawGamesCount,
              lostGamesCount,
              goalsScored,
              goalsConceded,
            },
          });
        } else {
          // Create a new entry
          await prisma.clubResult.create({
            data: {
              clubId,
              clubName,
              wonGamesCount,
              drawGamesCount,
              lostGamesCount,
              goalsConceded,
              goalsScored,
            },
          });
        }
      }

      res.status(200).json({ message: "Classements saved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        return res
          .status(400)
          .json({ error: error.errors.map((e) => e.message).join(", ") });
      }

      console.error("Error saving classements:", error);
      res.status(500).json({ error: "Error saving classements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
