import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

const OUTPUT_DIR = path.join(process.cwd(), "data", "pokemon");
const MAX_RETRY = 5;
const CONCURRENCY = 30; // セマフォ30

type PokemonData = {
  id: number;
  name: string;
  types: string[];
  stats: number[];
  image: string;
};

async function fetchAndSavePokemon(id: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRY) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} for ID ${id}`);
      }
      const data = await res.json();

      const base_h = Number(data.stats[0].base_stat);
      const base_a = Number(data.stats[1].base_stat);
      const base_b = Number(data.stats[2].base_stat);
      const base_c = Number(data.stats[3].base_stat);
      const base_d = Number(data.stats[4].base_stat);
      const base_s = Number(data.stats[5].base_stat);

      const result: PokemonData = {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        stats: [base_h, base_a, base_b, base_c, base_d, base_s],
        image: data.sprites.other["official-artwork"].front_default,
      };

      const filePath = path.join(OUTPUT_DIR, `${id}.json`);
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");

      console.log(`saved: ${id}`);
      break;

    } catch (error) {
      attempt++;
      console.error(`Failed to fetch/save Pokémon ${id} (attempt ${attempt}):`, error);

      if (attempt >= MAX_RETRY) {
        console.error(`Giving up on Pokémon ${id} after ${MAX_RETRY} attempts.`);
        return; // throwではなく無視して継続
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

  console.log(`Total Pokémon to fetch: ${pokemonIds.length}`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const limit = pLimit(CONCURRENCY);
  const tasks = pokemonIds.map(id => limit(() => fetchAndSavePokemon(id)));
  await Promise.all(tasks);
}

main().catch(console.error);
