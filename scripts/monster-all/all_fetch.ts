import fs from "fs/promises";
import path from "path";
import { main as fetchPokemon } from "./fetch-all-pokemon.js";
import { main as fetchSpecies } from "./fetch-all-species.js";
import { main as fetchForms } from "./fetch-all-forms.js";

async function main(): Promise<void> {
  try {
    console.log("Starting parallel fetch of Pokemon, Species, and Forms...");

    const startTime = Date.now();

    // 3つのスクリプトを並行実行
    await Promise.all([
      fetchPokemon(),
      fetchSpecies(),
      fetchForms()
    ]);

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log(`✅ All fetches completed successfully in ${duration} seconds!`);

    // 取得した件数を集計
    const pokemonDir = path.join(process.cwd(), "data", "pokemon");
    const speciesDir = path.join(process.cwd(), "data", "species");
    const formsDir = path.join(process.cwd(), "data", "forms");

    const [pokemonFiles, speciesFiles, formsFiles] = await Promise.all([
      fs.readdir(pokemonDir).then(files => files.filter(f => f.endsWith('.json'))),
      fs.readdir(speciesDir).then(files => files.filter(f => f.endsWith('.json'))),
      fs.readdir(formsDir).then(files => files.filter(f => f.endsWith('.json')))
    ]);

    console.log(`📊 Summary:`);
    console.log(`  Pokemon: ${pokemonFiles.length} files`);
    console.log(`  Species: ${speciesFiles.length} files`);
    console.log(`  Forms: ${formsFiles.length} files`);
    console.log(`  Total: ${pokemonFiles.length + speciesFiles.length + formsFiles.length} files`);

  } catch (error) {
    console.error("❌ Error during parallel fetch:", error);
    process.exit(1);
  }
}

main().catch(console.error);
