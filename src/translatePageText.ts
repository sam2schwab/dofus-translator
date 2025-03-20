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

  for (const node of textNodes) {
    const originalText = node.nodeValue;
    if (originalText) {
      const translatedHtml = await translate(originalText, language);

      if (translatedHtml !== originalText && node.parentNode) {
        const wrapper = document.createElement("span");
        wrapper.innerHTML = translatedHtml; // Allow partial HTML replacement
        node.parentNode.replaceChild(wrapper, node);
      }
    }
  }
}

translatePageText();
