interface ClassementJournee {
  "@id": string;
  "@type": string;
  season: number;
  date: string;
  cj_no: number;
  type: string;
  point_count: number;
  penalty_point_count: number;
  won_games_count: number;
  draw_games_count: number;
  lost_games_count: number;
  forfeits_games_count: number;
  goals_for_count: number;
  goals_against_count: number;
  rank: number;
  poule: {
    "@id": string;
    "@type": string;
    stage_number: number;
    name: string;
    cdg: {
      "@id": string;
      "@type": string;
      cg_no: number;
      external_updated_at: string;
    };
    external_updated_at: string;
    poule_unique: boolean;
  };
  equipe: {
    "@id": string;
    "@type": string;
    club: {
      "@id": string;
      "@type": string;
      cl_no: number;
      external_updated_at: string;
    };
    category_code: string;
    number: number;
    code: number;
    short_name: string;
    short_name_ligue: string;
    short_name_federation: string;
    type: string;
    external_updated_at: string;
    category_label: string;
    category_gender: string;
  };
  external_updated_at: string;
  goals_diff: number;
  total_games_count: number;
}

interface ApiResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:member": ClassementJournee[];
}

interface ClubData {
  logo: string;
  contacts: Array<{
    "@type": string;
    "@id": string;
    type: string;
    type_label: string;
    value: string;
  }>;
}
