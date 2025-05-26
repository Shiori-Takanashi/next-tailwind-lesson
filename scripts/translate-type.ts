import fs from "fs/promises";
import path from "path";

const TYPE_MAP_PATH = path.join(process.cwd(), "data", "mapping", "type_map.json");

export async function loadTypeMap(): Promise<Record<string, string>> {
    const raw = await fs.readFile(TYPE_MAP_PATH, "utf-8");
    return JSON.parse(raw);
}

export function translateTypes(rawTypes: string[], typeMap: Record<string, string>): string[] {
    return rawTypes.map(t => typeMap[t] ?? t);
}
