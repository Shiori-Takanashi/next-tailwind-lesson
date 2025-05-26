import fs from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "data", "pokemon");

type PokemonData = {
    id: number;
    name: string;
    types: string[];
    image: string;
};

async function fetchAndSavePokemon(id: number): Promise<void> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const result: PokemonData = {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        image: data.sprites.other["official-artwork"].front_default
    };

    const filePath = path.join(OUTPUT_DIR, `${id}.json`);

    // ディレクトリが無ければ作成（再帰的）
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");
}

async function main(): Promise<void> {
    for (let id = 1; id <= 10; id++) {
        await fetchAndSavePokemon(id);
        console.log(`saved: ${id}`);
    }
}

main().catch(console.error);
