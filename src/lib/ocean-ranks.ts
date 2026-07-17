export type OceanRank = {
  level: number;
  name: string;
  minScore: number;
  image: string;
};

export const OCEAN_RANKS: readonly OceanRank[] = [
  { level: 1, name: "플랑크톤", minScore: 0, image: "/ranks/rank-01-plankton.png?v=2" },
  { level: 2, name: "멸치", minScore: 20, image: "/ranks/rank-02-anchovy.png?v=2" },
  { level: 3, name: "새우", minScore: 50, image: "/ranks/rank-03-shrimp.png?v=2" },
  { level: 4, name: "연어", minScore: 100, image: "/ranks/rank-04-salmon.png?v=2" },
  { level: 5, name: "복어", minScore: 180, image: "/ranks/rank-05-pufferfish.png?v=2" },
  { level: 6, name: "장어", minScore: 300, image: "/ranks/rank-06-eel.png?v=2" },
  { level: 7, name: "문어", minScore: 500, image: "/ranks/rank-07-octopus.png?v=2" },
  { level: 8, name: "물개", minScore: 800, image: "/ranks/rank-08-seal.png?v=2" },
  { level: 9, name: "황제펭귄", minScore: 1_200, image: "/ranks/rank-09-emperor-penguin.png?v=2" },
  { level: 10, name: "바다거북", minScore: 1_700, image: "/ranks/rank-10-sea-turtle.png?v=2" },
  { level: 11, name: "해달", minScore: 2_300, image: "/ranks/rank-11-sea-otter.png?v=2" },
  { level: 12, name: "돌고래", minScore: 3_000, image: "/ranks/rank-12-dolphin.png?v=2" },
  { level: 13, name: "만타가오리", minScore: 4_000, image: "/ranks/rank-13-manta-ray.png?v=2" },
  { level: 14, name: "백상아리", minScore: 5_300, image: "/ranks/rank-14-great-white-shark.png?v=2" },
  { level: 15, name: "대왕오징어", minScore: 7_000, image: "/ranks/rank-15-giant-squid.png?v=2" },
  { level: 16, name: "혹등고래", minScore: 9_000, image: "/ranks/rank-16-humpback-whale.png?v=2" },
  { level: 17, name: "향유고래", minScore: 12_000, image: "/ranks/rank-17-sperm-whale.png?v=2" },
  { level: 18, name: "벨루가", minScore: 16_000, image: "/ranks/rank-18-beluga.png?v=2" },
  { level: 19, name: "범고래", minScore: 22_000, image: "/ranks/rank-19-orca.png?v=2" },
  { level: 20, name: "흰수염고래", minScore: 30_000, image: "/ranks/rank-20-fin-whale.png?v=2" },
] as const;

export function getOceanRank(score: number): OceanRank {
  const safeScore = Math.max(0, score);

  return (
    [...OCEAN_RANKS].reverse().find((rank) => safeScore >= rank.minScore) ??
    OCEAN_RANKS[0]
  );
}
