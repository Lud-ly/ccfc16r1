export interface ArrowBackProps {
  iSize: number;
}

export interface ClubData {
  logo: string;
}

interface ClassementJournee {
  "@id": string;
  rank: number;
  point_count: number;
  total_games_count: number;
  won_games_count: number;
  draw_games_count: number;
  lost_games_count: number;
  goals_for_count: number;
  goals_against_count: number;
  goals_diff: number;
  equipe: {
    club: {
      "@id": string;
    };
    short_name: string;
  };
  external_updated_at: string;
}

interface ApiResponse {
  "hydra:member": ClassementJournee[];
}

interface ClubResult {
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  totalGames: number;
  goals_for_count: number;
  goals_against_count: number;
  trend: string;
}
