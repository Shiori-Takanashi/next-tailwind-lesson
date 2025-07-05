import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

const OUTPUT_DIR = path.join(process.cwd(), "data", "forms");
const IDS_PATH = path.join(process.cwd(), "data", "meta", "form_ids.json");
const API_BASE = "https://pokeapi.co/api/v2/pokemon-form";

const MAX_RETRY = 5;
const CONCURRENCY = 30;

type FormData = {
  id: number;
  name: string;
  form_name: string;
  is_default: boolean;
  is_battle_only: boolean;
  is_mega: boolean;
  order: number;
  form_order: number;
  pokemon: {
    name: string;
    url: string;
  };
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
};

async function fetchAndSaveForm(id: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRY) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ID ${id}`);

      const data = await res.json();

      const result: FormData = {
        id: data.id,
        name: data.name,
        form_name: data.form_name,
        is_default: data.is_default,
        is_battle_only: data.is_battle_only,
        is_mega: data.is_mega,
        order: data.order,
        form_order: data.form_order,
        pokemon: {
          name: data.pokemon.name,
          url: data.pokemon.url,
        },
        sprites: {
          front_default: data.sprites.front_default,
          front_shiny: data.sprites.front_shiny,
          back_default: data.sprites.back_default,
          back_shiny: data.sprites.back_shiny,
        },
        types: data.types.map((t: any) => ({
          slot: t.slot,
          type: {
            name: t.type.name,
            url: t.type.url,
          },
        })),
      };

      const filePath = path.join(OUTPUT_DIR, `${id}.json`);
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");

      console.log(`saved form: ${id}`);
      break;

    } catch (error) {
      attempt++;
      console.error(`Failed to fetch form ${id} (attempt ${attempt}):`, error);

      if (attempt >= MAX_RETRY) {
        console.error(`Giving up on form ${id} after ${MAX_RETRY} attempts.`);
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

  console.log(`Total forms to fetch: ${ids.length}`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const limit = pLimit(CONCURRENCY);
  const tasks = ids.map(id => limit(() => fetchAndSaveForm(id)));

  await Promise.all(tasks);
}

main().catch(console.error);
