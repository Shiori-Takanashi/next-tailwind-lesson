import { spawn } from "child_process";
import path from "path";

const scriptsDir = path.join(process.cwd(), "scripts", "monster-all-raw");

function runScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(scriptsDir, scriptName);
    const child = spawn("node", ["--loader", "ts-node/esm", scriptPath], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully`);
        resolve();
      } else {
        console.error(`❌ ${scriptName} failed with code ${code}`);
        reject(new Error(`${scriptName} failed with code ${code}`));
      }
    });

    child.on("error", (error) => {
      console.error(`❌ Failed to start ${scriptName}:`, error);
      reject(error);
    });
  });
}

async function main(): Promise<void> {
  console.log("🚀 Starting raw data fetch for all endpoints...");

  const scripts = [
    "fetch-raw-pokemon.ts",
    "fetch-raw-species.ts",
    "fetch-raw-forms.ts"
  ];

  try {
    // 全てのスクリプトを並列実行
    await Promise.all(scripts.map(script => runScript(script)));

    console.log("🎉 All raw data fetch completed successfully!");

  } catch (error) {
    console.error("💥 Raw data fetch failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
