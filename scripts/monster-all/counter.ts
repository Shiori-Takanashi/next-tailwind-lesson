import fs from 'fs/promises';
import path from 'path';
import { pokemonEndpoint, speciesEndpoint } from '../../config/endpoint.ts';

async function fetchAllItemIds(endpoint: string): Promise<number[]> {
  let allIds: number[] = [];
  let nextUrl: string | null = endpoint + '?limit=50';

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store', // キャッシュを無効化
        'Pragma': 'no-cache',          // 互換性確保用
      },
      cache: 'no-store' // fetch APIのキャッシュモード（念のため）
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data: { results: { url: string }[]; next: string | null } = await res.json();

    const ids = data.results.map(({ url }) => {
      const match = url.match(/\/(\d+)\/?$/);
      if (!match) throw new Error(`Invalid URL format: ${url}`);
      return Number(match[1]);
    });

    allIds = allIds.concat(ids);
    nextUrl = data.next;
  }

  return allIds;
}


(async () => {
  try {
    const OUTPUT_DIR = path.join(process.cwd(), 'data/meta');
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log('Fetching Pokémon list...');
    const pokemons = await fetchAllItemIds(pokemonEndpoint);
    const pokemonOutPath = path.join(OUTPUT_DIR, 'pokemon_ids.json');
    await fs.writeFile(pokemonOutPath, JSON.stringify(pokemons, null, 2), 'utf-8');
    console.log(`Saved Pokémon IDs to ${pokemonOutPath}`);

    console.log('Fetching Species list...');
    const species = await fetchAllItemIds(speciesEndpoint);
    const speciesOutPath = path.join(OUTPUT_DIR, 'species_ids.json');
    await fs.writeFile(speciesOutPath, JSON.stringify(species, null, 2), 'utf-8');
    console.log(`Saved Species IDs to ${speciesOutPath}`);
  } catch (err) {
    console.error('Error during fetching:', err);
    process.exit(1);
  }
})();
