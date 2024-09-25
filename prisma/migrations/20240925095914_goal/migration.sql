/*
  Warnings:

  - Added the required column `goalsConceded` to the `ClubResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalsScored` to the `ClubResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubResult" ADD COLUMN     "goalsConceded" INTEGER NOT NULL,
ADD COLUMN     "goalsScored" INTEGER NOT NULL;
