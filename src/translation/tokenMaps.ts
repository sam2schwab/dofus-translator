import { Language } from "./languages";
import axios from "axios";

const REPO = 'sam2schwab/dofus-translator';

type TokenMap = Record<string, any>;

const cache: {[key in Language]?: Promise<TokenMap>} = {}

export const getTokenMap = async (language: Language) => {
  if (cache[language] === undefined) {
    cache[language] = axios.get(`https://raw.githubusercontent.com/${REPO}/main/tokenMaps/tokenMap_${language}.json`).then(({data}) => data);
  }
  return cache[language];
};
