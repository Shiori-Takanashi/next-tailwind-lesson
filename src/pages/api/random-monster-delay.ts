// filepath: /home/shiori/allprojects/azure-projects/next-tailwind-lesson/src/pages/api/random-monster-delay.ts
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { monster_count } from '../../../config/monster_count';

// ========================================
// 定数定義
// ========================================

/** 遅延時間（ミリ秒） - テスト用に5秒の遅延を設定 */
const DELAY_MS = 5000;

// ========================================
// 状態管理
// ========================================

/** 前回生成されたIDを記録（重複回避用） */
let lastId: number | null = null;

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 指定された時間だけ処理を遅延させる関数
 * @param ms - 遅延時間（ミリ秒）
 * @returns Promise<void>
 */
const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// ========================================
// APIハンドラー
// ========================================

/**
 * 遅延付きランダムモンスター取得API
 *
 * 5秒の遅延後に正規のモンスターデータを返すエンドポイント。
 * ローディング状態のUIテストやスピナー表示のテストに使用。
 *
 * @param req - Next.js APIリクエストオブジェクト
 * @param res - Next.js APIレスポンスオブジェクト
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 5秒間の遅延を実行
        console.log('⏳ 5秒の遅延を開始...');
        await delay(DELAY_MS);
        console.log('✅ 遅延完了、正規データ取得を開始');

        // 前回と異なるIDを生成（重複回避）
        let id: number;
        do {
            id = Math.floor(Math.random() * monster_count) + 1;
        } while (id === lastId);

        lastId = id; // 生成したIDを記録

        // モンスターデータファイルを読み込み
        const filePath = path.join(process.cwd(), 'data', 'monster', `${id}.json`);
        const json = await fs.readFile(filePath, 'utf-8');
        const monster = JSON.parse(json);

        // キャッシュ無効化ヘッダーを設定
        res.setHeader('Cache-Control', 'no-store');

        console.log(`📦 モンスターID ${id} のデータを送信`);
        res.status(200).json(monster);
    } catch (error) {
        console.error('❌ 遅延API処理中にエラーが発生:', error);
        res.status(500).json({
            error: '遅延API処理中にエラーが発生しました',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
