"use client";

import Navigation from "~/src/components/Sections/components/Navigation";
import Classement from "~/src/components/Sections/widgets/Classement";
import { prisma } from "~/src/db/prisma";
export default async function Home() {
  const clubResult = await prisma.clubResult.findMany();

  console.log(clubResult);
  return (
    <div className="home">
      <Navigation />
      <Classement />
    </div>
  );
}
