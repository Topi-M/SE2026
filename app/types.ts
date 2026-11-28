export type XpPoint = { expLevel: number; recordedAt: string };
export type HeistPoint = { darkElixirLooted: number; recordedAt: string };
export type WarStarsPoint = { warStars: number; recordedAt: string };

export type LeagueSeason = {
  seasonStart: string;
  rank: number;
  leagueName: string;
  leagueTrophies: number;
  placement: number;
  attackWins: number;
  attackLosses: number;
  maxBattles: number;
};

export type LeagueHistory = {
  tiers: { rank: number; name: string }[];
  history: LeagueSeason[];
};
