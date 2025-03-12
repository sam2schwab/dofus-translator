import { translate } from "./translation/translate";

async function translatePageText() {
  document.body.innerHTML = await translate(document.body.innerHTML, 'en');
}

translatePageText();
