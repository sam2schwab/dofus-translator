import { writeFile, readFile } from "node:fs/promises";
import { dofusdb } from "./libs/dofusdb";
import { categories, Category } from "./utils/categories";
import path from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const writeCache = async (name: string, data: any) => {
  const filePath = path.join(__dirname, `../cache/${name}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

async function readCache(name: string) {
  try {
    const filePath = path.join(__dirname, `../cache/${name}.json`);
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      console.log(
        `File not found: cache/${name}.json, will download from scratch`
      );
      return null; // Explicitly return null if the file doesn't exist
    }
    throw err; // Rethrow other errors
  }
}

const LIMIT = 50;

const updateCacheForCategory = async (category: Category, version: string) => {
  const file = await readCache(category);
  if (file?.version === version) {
    console.log(`${category} is up to date, skipping`);
  }

  let skip = 0;
  const { data: response } = await dofusdb.get(
    `/${category}?$limit=${LIMIT}&$skip=${skip}`
  );
  const items = response.data as any[];
  while (items.length < response.total) {
    skip += LIMIT;
    const {
      data: { data: currentItems },
    } = await dofusdb.get(`/${category}?$limit=${LIMIT}&$skip=${skip}`);
    items.push(...currentItems);
  }

  await writeCache(category, { version, data: items });
};

const main = async () => {
  const { data: version } = await dofusdb.get("/version");
  await Promise.all(
    categories.map((category) => updateCacheForCategory(category, version))
  );
};

main();
