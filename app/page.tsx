"use client";

import { useEffect, useState } from "react";
import Navigation from "~/src/components/Sections/components/Navigation";
import Classement from "~/src/components/Sections/widgets/Classement";

interface ClubResult {
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  totalGames: number;
  goalsConceded: number;
  goalsScored: number;
  trend: string;
}

export default function Home() {
  const [clubResults, setClubResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubResults = async () => {
      try {
        const res = await fetch("/api/club-actions/club-results");
        const data: ClubResult[] = await res.json();
        setClubResults(data);
      } catch (error) {
        console.error("Failed to fetch club results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubResults();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <Navigation />
      <Classement />
      <div className="club-results">
        <h2>Club Results</h2>
        {clubResults.length > 0 ? (
          <ul>
            {clubResults.map((result) => (
              <li key={result.clubId}>
                <p>Club: {result.clubName}</p>
                <p>Wins: {result.wonGamesCount}</p>
                <p>Draws: {result.drawGamesCount}</p>
                <p>Losses: {result.lostGamesCount}</p>
                <p>Goals Scored: {result.goalsScored}</p>
                <p>Goals Conceded: {result.goalsConceded}</p>
                <p>Trend: {result.trend}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results available</p>
        )}
      </div>
    </div>
  );
}
