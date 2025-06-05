import { NextApiRequest, NextApiResponse } from 'next';

// ========================================
// 定数定義
// ========================================

/** API処理の遅延時間（ミリ秒） */
const DELAY_TIME = 5000; // 5秒

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
        name: "遅延ミッシングモンスター",
        types: [],  // 空のタイプ配列
        image: ""   // 空の画像URL
    },

    /** パターン4: 型不一致データ */
    TYPE_MISMATCH: {
        id: "invalid_delayed_id",
        name: 99999,
        types: "delayed_not_an_array",
        image: false
    },

    /** パターン5: 構造不正データ（必須フィールド欠損） */
    MALFORMED: {
        wrong_field: "delayed invalid data",
        delay_time: DELAY_TIME,
        // 必須フィールド（name, types, image）が存在しない
    }
} as const;

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
 * 遅延不正データ送信API
 *
 * 5秒間の遅延後に不正なデータ構造やnull値を含むレスポンスを返す。
 * 遅延とエラーハンドリングの両方をテストするためのエンドポイント。
 *
 * 用途:
 * - 長時間のデータ取得とエラーハンドリングの組み合わせテスト
 * - タイムアウト設定のテスト
 * - 遅延環境でのバリデーション機能のテスト
 * - エラー状態UIの長時間表示テスト
 *
 * @param req - Next.js APIリクエストオブジェクト
 * @param res - Next.js APIレスポンスオブジェクト
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const startTime = Date.now();

    try {
        console.log(`⏱️  遅延不正データAPI: ${DELAY_TIME}ms の遅延を開始`);

        // キャッシュ無効化ヘッダーを設定
        res.setHeader('Cache-Control', 'no-store');

        // 5秒間の遅延を実行
        await delay(DELAY_TIME);

        // ランダムに不正データパターンを選択
        const { pattern, data } = getRandomInvalidData();

        const elapsedTime = Date.now() - startTime;
        console.log(`🚨 遅延不正データパターン "${pattern}" を ${elapsedTime}ms 後に送信`);
        console.log('📤 送信データ:', JSON.stringify(data, null, 2));

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
        const elapsedTime = Date.now() - startTime;
        console.error(`❌ 遅延不正データAPI処理中にエラーが発生 (${elapsedTime}ms 経過):`, error);
        res.status(500).json({
            error: '遅延不正データAPI処理中にエラーが発生しました',
            delay_time: DELAY_TIME,
            elapsed_time: Date.now() - startTime,
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
