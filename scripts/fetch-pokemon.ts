import fs from "fs/promises";
import path from "path";
import { monster_count } from "../config/monster_count.js";

const OUTPUT_DIR = path.join(process.cwd(), "data", "pokemon");

type PokemonData = {
    id: number;
    name: string;
    types: string[];
    stats: number[];
    image: string;
};

async function fetchAndSavePokemon(id: number): Promise<void> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    // data.stats[0]から[5]までのbase_statを取り出して数値に変換
    const base_h = Number(data.stats[0].base_stat); // HP
    const base_a = Number(data.stats[1].base_stat); // Attack
    const base_b = Number(data.stats[2].base_stat); // Defense
    const base_c = Number(data.stats[3].base_stat); // Special Attack
    const base_d = Number(data.stats[4].base_stat); // Special Defense
    const base_s = Number(data.stats[5].base_stat); // Speed

    const result: PokemonData = {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        stats: [base_h, base_a, base_b, base_c, base_d, base_s], // 6つのステータス値を数値配列として格納
        image: data.sprites.other["official-artwork"].front_default
    };

    const filePath = path.join(OUTPUT_DIR, `${id}.json`);

    // ディレクトリが無ければ作成（再帰的）
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");
}

export async function main(): Promise<void> {
    for (let id = 1; id <= monster_count; id++) {
        await fetchAndSavePokemon(id);
        console.log(`saved: ${id}`);
    }
}

main().catch(console.error);
