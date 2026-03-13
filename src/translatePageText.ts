import { translate } from "./translation/translate";

async function translatePageText() {
  const language = (window as any).myExtensionConfig?.language || "en";
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  const textNodes = [];

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node); // Collect text nodes
  }

  for (const textNode of textNodes) {
    const originalText = textNode.nodeValue;
    if (!originalText || !textNode.parentNode) continue;

    const translatedHtml = await translate(originalText, language);
    if (translatedHtml === originalText) continue;

    const template = document.createElement("template");
    template.innerHTML = translatedHtml;

    textNode.replaceWith(template.content.cloneNode(true));
  }
}

translatePageText();
