/**
 * ポケモンのタイプ名を英語から日本語に翻訳するためのマッピング定義
 */

// ポケモンタイプの英語名から日本語名への対応表の型定義
export type PokemonTypeTranslations = {
    readonly [englishTypeName: string]: string;
};

// ポケモンタイプの翻訳マップ
export const pokemonTypeTranslations: PokemonTypeTranslations = {
    normal: "普",
    fire: "炎",
    water: "水",
    grass: "草",
    electric: "電",
    ice: "氷",
    fighting: "闘",
    poison: "毒",
    ground: "地",
    flying: "飛",
    psychic: "超",
    bug: "虫",
    rock: "岩",
    ghost: "霊",
    dragon: "竜",
    dark: "悪",
    steel: "鋼",
    fairy: "妖",
} as const;

// 利用可能な英語タイプ名の型
export type EnglishPokemonType = keyof typeof pokemonTypeTranslations;

// 利用可能な日本語タイプ名の型
export type JapanesePokemonType = typeof pokemonTypeTranslations[EnglishPokemonType];

/**
 * 英語のポケモンタイプ名配列を日本語に翻訳する
 * @param englishTypes 英語のタイプ名配列
 * @returns 日本語に翻訳されたタイプ名配列
 */
export function translatePokemonTypes(englishTypes: string[]): string[] {
    return englishTypes.map(type =>
        pokemonTypeTranslations[type as EnglishPokemonType] ?? type
    );
}

/**
 * 単一の英語タイプ名を日本語に翻訳する
 * @param englishType 英語のタイプ名
 * @returns 日本語のタイプ名（見つからない場合は元の値）
 */
export function translateSinglePokemonType(englishType: string): string {
    return pokemonTypeTranslations[englishType as EnglishPokemonType] ?? englishType;
}

/**
 * 翻訳マップを取得する（後方互換性のため）
 * @deprecated pokemonTypeTranslations を直接使用してください
 * @returns 翻訳マップ
 */
export function loadTypeMap(): Record<string, string> {
    return pokemonTypeTranslations;
}

/**
 * タイプ翻訳（後方互換性のため）
 * @deprecated translatePokemonTypes を使用してください
 * @param rawTypes 英語のタイプ名配列
 * @param typeMap 翻訳マップ
 * @returns 翻訳されたタイプ名配列
 */
export function translateTypes(rawTypes: string[], typeMap: Record<string, string>): string[] {
    return rawTypes.map(t => typeMap[t] ?? t);
}
