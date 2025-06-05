import { z } from 'zod';

// ========================================
// Zodスキーマ定義
// ========================================

/**
 * モンスターデータのZodスキーマ
 * APIレスポンスの動的型チェックに使用
 */
export const MonsterSchema = z.object({
    name: z.string().min(1, "モンスター名は必須です"),
    types: z.array(z.string()).min(1, "少なくとも1つのタイプが必要です"),
    image: z.string().url("有効な画像URLが必要です").or(z.literal(""))
});

/**
 * エラーレスポンスのZodスキーマ
 * APIエラー時のレスポンス検証に使用
 */
export const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string().optional(),
    status: z.number().optional()
});

// ========================================
// 型エクスポート
// ========================================

/** Zodスキーマから型を推論 */
export type Monster = z.infer<typeof MonsterSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ========================================
// バリデーション関数
// ========================================

/**
 * APIレスポンスがモンスターデータかどうかを動的に検証
 * @param data - 検証対象のデータ
 * @returns バリデーション結果
 */
export const validateMonsterData = (data: unknown) => {
    return MonsterSchema.safeParse(data);
};

/**
 * APIレスポンスがエラーレスポンスかどうかを動的に検証
 * @param data - 検証対象のデータ
 * @returns バリデーション結果
 */
export const validateErrorResponse = (data: unknown) => {
    return ErrorResponseSchema.safeParse(data);
};

// ========================================
// エラーハンドリングヘルパー
// ========================================

/**
 * Zodバリデーションエラーを人間が読みやすい形式に変換
 * @param error - Zodエラーオブジェクト
 * @returns フォーマットされたエラーメッセージ
 */
export const formatZodError = (error: z.ZodError): string => {
    const firstError = error.errors[0];
    if (firstError) {
        const path = firstError.path.length > 0 ? `${firstError.path.join('.')}: ` : '';
        return `${path}${firstError.message}`;
    }
    return 'データ形式が正しくありません';
};

/**
 * APIレスポンスを包括的に検証し、適切なエラーメッセージを生成
 * @param data - APIから受け取ったデータ
 * @returns 検証結果とエラーメッセージ
 */
export const validateApiResponse = (data: unknown): {
    success: boolean;
    data?: Monster;
    error?: string
} => {
    // まずモンスターデータとして検証
    const monsterResult = validateMonsterData(data);
    if (monsterResult.success) {
        return { success: true, data: monsterResult.data };
    }

    // エラーレスポンスとして検証
    const errorResult = validateErrorResponse(data);
    if (errorResult.success) {
        return {
            success: false,
            error: "不正なデータです"
        };
    }

    // どちらでもない場合はスキーマエラー
    return {
        success: false,
        error: "不正なデータです"
    };
};
