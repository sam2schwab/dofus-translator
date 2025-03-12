import { Language } from "./languages";
import { translateLine } from "./translateLine";

export const translate = async (text: string, language: Language) => {
  const lines = await Promise.all(
    text.split("\n").map((text) => translateLine(text, language))
  );
  return lines.join("\n");
};
