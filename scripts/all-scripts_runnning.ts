import { main as fetchPokemonMain } from './fetch-pokemon.ts';
import { main as fetchSpeciesMain } from './fetch-species.ts';
import { main as buildMonsterMain } from './build-monster.ts';

async function runAll() {
    try {
        console.log('Starting to fetch Pokemon data...');
        await fetchPokemonMain();
        console.log('Finished fetching Pokemon data.');

        console.log('Starting to fetch Species data...');
        await fetchSpeciesMain();
        console.log('Finished fetching Species data.');

        console.log('Starting to build Monster data...');
        await buildMonsterMain();
        console.log('Finished building Monster data.');

        console.log('All scripts executed successfully!');
    } catch (error) {
        console.error('An error occurred during script execution:', error);
        process.exit(1); // エラーが発生した場合はエラーコードで終了
    }
}

runAll();
