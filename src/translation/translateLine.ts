import { Language } from "./languages";
import { tokenize } from "./tokenize";
import { getTokenMap } from "./tokenMaps";

const cleanString = (s: string) => s.replace("œ", "oe").replace('’', '\'').replace('Œ', 'Oe');

export const translateLine = async (line: string,  language: Language) => {
    const tokenMap = getTokenMap(language);
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
          bestMatch = currentMap?.["__default"];
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