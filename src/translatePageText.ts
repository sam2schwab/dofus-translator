import { translate } from "./translation/translate";

const COPYABLE_SELECTOR = ".dofus-translator-copyable";
const STYLE_ID = "dofus-translator-copyable-style";
const LISTENER_FLAG = "__dofusTranslatorCopyListenerAttached";

const copyWithExecCommand = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    copyWithExecCommand(text);
  }
};

const showCopyFeedback = (element: HTMLElement) => {
  const previousTitle = element.getAttribute("title");
  element.setAttribute("title", "Copied");
  element.dataset.copyState = "copied";

  window.setTimeout(() => {
    if (previousTitle) {
      element.setAttribute("title", previousTitle);
    } else {
      element.removeAttribute("title");
    }
    delete element.dataset.copyState;
  }, 1200);
};

const handleCopyInteraction = async (element: HTMLElement) => {
  const text = element.dataset.copyText;
  if (!text) return;

  await copyText(text);
  showCopyFeedback(element);
};

const attachCopyListeners = () => {
  if ((window as typeof window & { [LISTENER_FLAG]?: boolean })[LISTENER_FLAG]) {
    return;
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const copyableElement = target.closest(COPYABLE_SELECTOR);
    if (!(copyableElement instanceof HTMLElement)) return;

    void handleCopyInteraction(copyableElement);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const copyableElement = target.closest(COPYABLE_SELECTOR);
    if (!(copyableElement instanceof HTMLElement)) return;

    event.preventDefault();
    void handleCopyInteraction(copyableElement);
  });

  (window as typeof window & { [LISTENER_FLAG]?: boolean })[LISTENER_FLAG] = true;
};

const injectCopyStyles = () => {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    ${COPYABLE_SELECTOR} {
      cursor: pointer;
      border-bottom: 1px dashed currentColor;
    }

    ${COPYABLE_SELECTOR}:hover,
    ${COPYABLE_SELECTOR}:focus-visible {
      background: rgba(255, 223, 93, 0.18);
      outline: none;
    }

    ${COPYABLE_SELECTOR}[data-copy-state="copied"] {
      background: rgba(115, 214, 115, 0.22);
    }
  `;
  document.head.appendChild(style);
};

async function translatePageText() {
  const language = (window as any).myExtensionConfig?.language || "en";
  injectCopyStyles();
  attachCopyListeners();

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
    const originalText = textNode.nodeValue?.trim() || "";
    if (originalText == "" || !textNode.parentNode) continue;

    const translatedHtml = await translate(originalText, language);
    if (translatedHtml === originalText) continue;

    const template = document.createElement("template");
    template.innerHTML = translatedHtml;

    textNode.parentNode.replaceChild(template.content.cloneNode(true) , textNode);
  }
}

translatePageText();
