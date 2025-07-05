import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

const OUTPUT_DIR = path.join(process.cwd(), "data", "raw-pokemon");
const MAX_RETRY = 5;
const CONCURRENCY = 30;

async function fetchAndSavePokemonRaw(id: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRY) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} for ID ${id}`);
      }

      // レスポンス全体をそのまま保存（フィルタリングしない）
      const rawData = await res.json();

      const filePath = path.join(OUTPUT_DIR, `${id}.json`);
      await fs.mkdir(OUTPUT_DIR, { recursive: true });

      // 生データをそのまま保存
      await fs.writeFile(filePath, JSON.stringify(rawData, null, 2), "utf-8");

      console.log(`saved raw pokemon: ${id}`);
      break;

    } catch (error) {
      attempt++;
      console.error(`Failed to fetch/save raw Pokemon ${id} (attempt ${attempt}):`, error);

      if (attempt >= MAX_RETRY) {
        console.error(`Giving up on raw Pokemon ${id} after ${MAX_RETRY} attempts.`);
        return;
      }

      const delayMs = 500 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function main(): Promise<void> {
  const pokemonIdsPath = path.join(process.cwd(), "data", "meta", "pokemon_ids.json");
  const pokemonIdsData = await fs.readFile(pokemonIdsPath, "utf-8");
  const pokemonIds: number[] = JSON.parse(pokemonIdsData);

  console.log(`Total raw Pokemon to fetch: ${pokemonIds.length}`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const limit = pLimit(CONCURRENCY);
  const tasks = pokemonIds.map(id => limit(() => fetchAndSavePokemonRaw(id)));
  await Promise.all(tasks);
}

main().catch(console.error);
