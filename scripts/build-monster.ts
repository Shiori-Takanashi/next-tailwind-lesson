import fs from "fs/promises";
import path from "path";
import { loadTypeMap, translateTypes } from "./translate-type.ts";


const INPUT_DIR = path.join(process.cwd(), "data");
const OUTPUT_DIR = path.join(INPUT_DIR, "monster");

type Monster = {
    id: number;
    name: string;
    types: string[];
    image: string;
};

type SpeciesData = {
    id: number;
    name: string;
};

type PokemonData = {
    id: number;
    name: string;
    types: string[];
    image: string;
};

function isPokemonData(data: any): data is PokemonData {
    return (
        typeof data?.id === "number" &&
        typeof data?.name === "string" &&
        Array.isArray(data?.types) &&
        data.types.every((t: any) => typeof t === "string") &&
        typeof data?.image === "string"
    );
}

function isSpeciesData(data: any): data is SpeciesData {
    return (
        typeof data?.id === "number" &&
        typeof data?.name === "string"
    );
}


async function buildMonster(id: number, typeMap: Record<string, string>) {
    const pokemonRaw = await fs.readFile(path.join(INPUT_DIR, "pokemon", `${id}.json`), "utf-8");
    const speciesRaw = await fs.readFile(path.join(INPUT_DIR, "species", `${id}.json`), "utf-8");

    const parsedPokemon = JSON.parse(pokemonRaw);
    const parsedSpecies = JSON.parse(speciesRaw);

    if (!isPokemonData(parsedPokemon)) {
        throw new Error(`Invalid pokemon data for ID ${id}`);
    }
    if (!isSpeciesData(parsedSpecies)) {
        throw new Error(`Invalid species data for ID ${id}`);
    }

    const pokemon: PokemonData = parsedPokemon;
    const species: SpeciesData = parsedSpecies;

    const jaName = species.name ?? `unknown`;

    const rawTypes = pokemon.types;
    const jaTypes = translateTypes(rawTypes, typeMap);

    const image = pokemon.image ?? "";

    const monster: Monster = {
        id: pokemon.id,
        name: jaName,
        types: jaTypes,
        image: image
    };

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const filePath = path.join(OUTPUT_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(monster, null, 2), "utf-8");

    console.log(`Built monster: ${id}`);
}

async function main() {
    const typeMap = await loadTypeMap();

    for (let id = 1; id <= 10; id++) {
        try {
            await buildMonster(id, typeMap);
        } catch (e) {
            console.warn(`Skipped ${id}: ${e}`);
        }
    }
}

main().catch(console.error);
