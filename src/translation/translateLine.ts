import { Language } from "./languages";
import { tokenize } from "./tokenize";
import { getTokenMap } from "./tokenMaps";

const cleanString = (s: string) => s.replace("œ", "oe").replace('’', '\'').replace('Œ', 'Oe');
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const translateLine = async (line: string,  language: Language) => {
    const tokenMap = await getTokenMap(language);
    const tokens = tokenize(cleanString(line));
    const result = [];
  
    let startPointer = 0;
    let endPointer = 0;
  
    while (startPointer < tokens.length) {
      //set up map and token
      let currentMap = tokenMap as Record<string, any>;
      let currentToken = tokens[endPointer];
      let bestMatch = currentToken;
      let bestMatchPosition = endPointer;
  
      while (currentMap !== undefined) {
        currentMap = currentMap[currentToken?.toLowerCase()];
        if (currentMap?.["__default"] !== undefined) {
          const translation = currentMap["__default"];
          const escapedTranslation = escapeHtml(translation);
          bestMatch = `<span class="notranslate dofus-translator-copyable" translate="no" data-copy-text="${escapedTranslation}" role="button" tabindex="0" title="Click to copy translation">${escapedTranslation}</span>`;
          bestMatchPosition = endPointer;
        }
        endPointer += 1;
        currentToken = tokens[endPointer];
      }
      result.push(bestMatch);
      startPointer = bestMatchPosition + 1;
      endPointer = startPointer;
    }
  
    return result.join("");
  };
