import fs from "fs/promises";
import path from "path";

// 新しいファイルから関数をインポート（後方互換性のため）
export { loadTypeMap, translateTypes } from "../config/pokemon-type-translations.ts";
