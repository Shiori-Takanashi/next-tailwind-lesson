// モンスターの総数を定義
export const monster_count: number = 200;

// 型定義をエクスポート（将来的な拡張用）
export type MonsterCountConfig = {
    count: number;
    minId: number;
    maxId: number;
};

// 設定オブジェクト（将来的な使用を想定）
export const monsterConfig: MonsterCountConfig = {
    count: monster_count,
    minId: 1,
    maxId: 1025,
};
