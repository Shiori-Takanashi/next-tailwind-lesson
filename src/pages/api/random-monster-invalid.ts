// filepath: /home/shiori/allprojects/azure-projects/next-tailwind-lesson/src/pages/api/random-monster-invalid.ts
import { NextApiRequest, NextApiResponse } from 'next';

// ========================================
// 定数定義
// ========================================

/** 不正データの生成パターン定義 */
const INVALID_DATA_PATTERNS = {
    /** パターン1: 必須フィールドにnull値 */
    NULL_FIELDS: {
        id: null,
        name: null,
        types: null,
        image: null
    },

    /** パターン2: 空文字列と空配列 */
    EMPTY_FIELDS: {
        id: 0,
        name: "",
        types: [],
        image: ""
    },

    /** パターン3: 部分的なデータ欠損 */
    PARTIAL_MISSING: {
        id: 42,
        name: "ミッシングモンスター",
        types: [],  // 空のタイプ配列
        image: ""   // 空の画像URL
    },

    /** パターン4: 型不一致データ */
    TYPE_MISMATCH: {
        id: "invalid_id",
        name: 12345,
        types: "not_an_array",
        image: false
    },

    /** パターン5: 構造不正データ（必須フィールド欠損） */
    MALFORMED: {
        wrong_field: "this should not exist",
        // 必須フィールド（name, types, image）が存在しない
    }
} as const;

// ========================================
// ユーティリティ関数
// ========================================

/**
 * ランダムに不正データパターンを選択する関数
 * @returns 不正データオブジェクト
 */
const getRandomInvalidData = () => {
    const patterns = Object.values(INVALID_DATA_PATTERNS);
    const randomIndex = Math.floor(Math.random() * patterns.length);
    const selectedPattern = patterns[randomIndex];
    const patternName = Object.keys(INVALID_DATA_PATTERNS)[randomIndex];

    return {
        pattern: patternName,
        data: selectedPattern
    };
};

// ========================================
// APIハンドラー
// ========================================

/**
 * 不正データ送信API
 *
 * エラーハンドリングのテスト用エンドポイント。
 * 意図的に不正なデータ構造やnull値を含むレスポンスを返す。
 *
 * 用途:
 * - フロントエンドのエラーハンドリングテスト
 * - バリデーション機能のテスト
 * - エラー状態UIの動作確認
 *
 * @param req - Next.js APIリクエストオブジェクト
 * @param res - Next.js APIレスポンスオブジェクト
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // ランダムに不正データパターンを選択
        const { pattern, data } = getRandomInvalidData();

        console.log(`🚨 不正データパターン "${pattern}" を送信`);
        console.log('📤 送信データ:', JSON.stringify(data, null, 2));

        // キャッシュ無効化ヘッダーを設定
        res.setHeader('Cache-Control', 'no-store');

        // 不正データの種類に応じてHTTPステータスコードを変更
        let statusCode = 200;

        switch (pattern) {
            case 'MALFORMED':
                // 構造不正の場合は400 Bad Request
                statusCode = 400;
                break;
            case 'TYPE_MISMATCH':
                // 型不一致の場合は422 Unprocessable Entity
                statusCode = 422;
                break;
            case 'NULL_FIELDS':
                // null値フィールドの場合は200だが不正なデータ
                statusCode = 200;
                break;
            case 'EMPTY_FIELDS':
                // 空文字列・空配列の場合は200だが部分的に無効
                statusCode = 200;
                break;
            case 'PARTIAL_MISSING':
                // 部分的なデータ欠損の場合は200だが不完全
                statusCode = 200;
                break;
            default:
                statusCode = 200;
        }

        res.status(statusCode).json(data);
    } catch (error) {
        console.error('❌ 不正データAPI処理中にエラーが発生:', error);
        res.status(500).json({
            error: '不正データAPI処理中にエラーが発生しました',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
