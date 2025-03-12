import { categories, Category } from "./utils/categories";
import { writeFile } from "node:fs/promises";
import { mergeDeep } from "./utils/deepMerge";
import { tokenize } from "./utils/tokenize";
import { blacklist, overrides } from "./utils/overrides";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const cleanString = (s: string) => s.toLowerCase().replace("œ", "oe").replace('’', '\'');

const languages = ["fr", "es", "en", "pt", "de"] as const;
type Language = (typeof languages)[number];

type Item = {
  name?: { [Lang in Language]?: string };
  message?: { [Lang in Language]?: string };
};

const tokensToMap = (tokens: string[], result: string): Record<string, any> => {
  const [firstToken, ...rest] = tokens;
  if (firstToken === undefined) return { __default: result };
  return { [firstToken]: tokensToMap(rest, result) };
};

const addToken = (
  tokenMap: Record<string, any>,
  fr: string | undefined,
  lang: string | undefined
) => {
  // check if translation exists and is different
  if (
    fr &&
    !blacklist.has(cleanString(fr)) &&
    lang &&
    !lang.startsWith("[!]") &&
    fr !== lang
  ) {
    const tokens = tokenize(cleanString(fr));
    const map = tokensToMap(tokens, lang);
    if (typeof map === "object") {
      mergeDeep(tokenMap, map);
    }
  }
};

const generateMap = async (
  categories: Category[],
  language: Language = "en"
) => {
  const tokenMap: Record<string, any> = {};
  for (const category of categories) {
    const categoryFile = path.join(__dirname, `../cache/${category}.json`);
    const categoryData: { data: Item[] } = await import(
      pathToFileURL(categoryFile).toString()
    );
    for (const item of categoryData.data) {
      const fr = item?.name?.fr || item?.message?.fr;
      const lang = item?.name?.[language] || item?.message?.[language];
      addToken(tokenMap, fr, lang);
    }
  }

  for (const [fr, override] of Object.entries(overrides)) {
    const lang = override[language];
    addToken(tokenMap, fr, lang);
  }

  const outputFile = path.join(
    __dirname,
    `../src/tokenMaps/tokenMap_${language}.json`
  );
  await writeFile(outputFile, JSON.stringify(tokenMap, null, 2), "utf-8");
};

const main = async () => {
  for (const language of languages) {
    if (language !== "fr") {
      generateMap([...categories], language);
    }
  }
};

main();
