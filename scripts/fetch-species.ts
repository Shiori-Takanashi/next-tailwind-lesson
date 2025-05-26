import fs from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "data", "species");

type SpeciesData = {
    id: number;
    name: string;
};

async function fetchAndSavePokemon(id: number): Promise<void> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await res.json();

    const jaNameObj = data.names.find((n: any) => n.language.name === "ja-Hrkt");
    const ja_name = jaNameObj?.name ?? "不明";

    const result: SpeciesData = {
        id: data.id,
        name: ja_name,
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
