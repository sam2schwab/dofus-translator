export const categories = [
    "achievements",
    "alignment-sides",
    "areas",
    "characteristics",
    "companions",
    "dungeons",
    "items",
    "jobs",
    "monsters",
    "monster-races",
    "npcs",
    "quests",
    "subareas",
    "super-areas",
    "worlds",
    "item-sets",
    "spells"
  ] as const;
  
  export type Category = (typeof categories)[number];
  