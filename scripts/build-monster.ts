import fs from "fs/promises";
import path from "path";
import { translatePokemonTypes } from "../config/pokemon-type-translations.js";
import { monster_count } from "../config/monster_count.js";

const INPUT_DIR = path.join(process.cwd(), "data");
const OUTPUT_DIR = path.join(INPUT_DIR, "monster");

type Monster = {
    id: number;
    name: string;
    types: string[];
    stats: number[];
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
    stats: number[];
    image: string;
};

function isPokemonData(data: any): data is PokemonData {
    return (
        typeof data?.id === "number" &&
        typeof data?.name === "string" &&
        Array.isArray(data?.types) &&
        data.types.every((t: any) => typeof t === "string") &&
        data.stats.every((s: any) => typeof s === "number") &&
        typeof data?.image === "string"
    );
}

function isSpeciesData(data: any): data is SpeciesData {
    return (
        typeof data?.id === "number" &&
        typeof data?.name === "string"
    );
}


async function buildMonster(id: number) {
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
    const jaTypes = translatePokemonTypes(rawTypes);

    const image = pokemon.image ?? "";

    const monster: Monster = {
        id: pokemon.id,
        name: jaName,
        types: jaTypes,
        stats: pokemon.stats,
        image: image
    };

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const filePath = path.join(OUTPUT_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(monster, null, 2), "utf-8");

    console.log(`Built monster: ${id}`);
}

export async function main() {
    for (let id = 1; id <= monster_count; id++) {
        try {
            await buildMonster(id);
        } catch (e) {
            console.warn(`Skipped ${id}: ${e}`);
        }
    }
}

main().catch(console.error);
