import { Language } from "./language";

export const overrides: Record<string, {[lang in Language]?: string}> = {
  Piou: {
    en: "Piwi",
  },
  PA: {
    en: "AP",
  },
  PM: {
    en: "MP",
  },
  PO: {
    en: "Range",
  },
  PV: {
    en: "HP",
  },
  DDG: {
    en: "Ice Dofus",
  },
  Émeraude: {
    en: "Emerald",
  },
  Pourpre: {
    en: "Crimson",
  },
  Ocre: {
    en: "Ochre",
  },
  Ivoire: {
    en: "Ivory",
  },
  Ébène: {
    en: "Ebony",
  },
  TDM: {
    en: "Around the world",
  },
  "Tour du monde": {
    en: "Around the world",
  },
  Pano: {
    en: "set",
  },
  Grobe: {
    en: "Nolifis",
  },
  HDV: {
    en: "market",
  },
  "Arbre Hakam": {
    en: "Tree Keeholo"
  },
  Kanniboul: {
    en: "Kanniball"
  },
  "Vol de vie": {
    en: "lifesteal"
  }
};

export const blacklist = new Set(["frappe", "contre", "altération"]);
