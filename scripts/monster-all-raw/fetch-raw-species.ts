import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

const OUTPUT_DIR = path.join(process.cwd(), "data", "raw-species");
const IDS_PATH = path.join(process.cwd(), "data", "meta", "species_ids.json");
const API_BASE = "https://pokeapi.co/api/v2/pokemon-species";

const MAX_RETRY = 5;
const CONCURRENCY = 30;

async function fetchAndSaveSpeciesRaw(id: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRY) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ID ${id}`);

      // レスポンス全体をそのまま保存（フィルタリングしない）
      const rawData = await res.json();

      const filePath = path.join(OUTPUT_DIR, `${id}.json`);
      await fs.mkdir(OUTPUT_DIR, { recursive: true });

      // 生データをそのまま保存
      await fs.writeFile(filePath, JSON.stringify(rawData, null, 2), "utf-8");

      console.log(`saved raw species: ${id}`);
      break;

    } catch (error) {
      attempt++;
      console.error(`Failed to fetch raw species ${id} (attempt ${attempt}):`, error);

      if (attempt >= MAX_RETRY) {
        console.error(`Giving up on raw species ${id} after ${MAX_RETRY} attempts.`);
        return;
      }

      const delayMs = 500 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export async function main(): Promise<void> {
  const raw = await fs.readFile(IDS_PATH, "utf-8");
  const ids: number[] = JSON.parse(raw);

  console.log(`Total raw species to fetch: ${ids.length}`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const limit = pLimit(CONCURRENCY);
  const tasks = ids.map(id => limit(() => fetchAndSaveSpeciesRaw(id)));

  await Promise.all(tasks);
}

main().catch(console.error);
