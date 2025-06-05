import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

// ========================================
// タイムアウトテスト用API
// ========================================

/**
 * タイムアウトテスト用API - 8秒待機してからレスポンスを返す
 * 7秒のタイムアウト設定をテストするために使用
 *
 * @param req - Next.js APIリクエスト
 * @param res - Next.js APIレスポンス
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        console.log("[API] タイムアウトテスト開始: 8秒待機します...");

        // 8秒待機（7秒のタイムアウトよりも長い）
        await new Promise(resolve => setTimeout(resolve, 8000));

        // モンスターデータの取得
        const monstersDir = path.join(process.cwd(), "data", "monster");
        const files = await fs.readdir(monstersDir);
        const jsonFiles = files.filter(file => file.endsWith(".json"));

        if (jsonFiles.length === 0) {
            return res.status(500).json({ error: "モンスターデータが見つかりません" });
        }

        // ランダムなファイルを選択
        const randomFile = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];
        const filePath = path.join(monstersDir, randomFile);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const monsterData = JSON.parse(fileContent);

        console.log("[API] タイムアウトテスト完了: データを返します");
        res.status(200).json(monsterData);
    } catch (error) {
        console.error("[API] タイムアウトテストでエラー:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "タイムアウトテスト中にエラーが発生しました"
        });
    }
}
