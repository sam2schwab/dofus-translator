import { translate } from "./translation/translate";

async function translatePageText() {
  const language = (window as any).myExtensionConfig?.language || "en";
  document.body.innerHTML = await translate(document.body.innerHTML, language);
}

translatePageText();
