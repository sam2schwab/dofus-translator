import en from "../tokenMaps/tokenMap_en.json";
import pt from "../tokenMaps/tokenMap_pt.json";
import de from "../tokenMaps/tokenMap_de.json";
import es from "../tokenMaps/tokenMap_es.json";

import { Language } from "./languages";

type TokenMap = Record<string, any>;

const mapsPromises: Record<Language, TokenMap> = {
  en,
  de,
  pt,
  es,
};

export const getTokenMap = (language: Language) => {
  return mapsPromises[language];
};
