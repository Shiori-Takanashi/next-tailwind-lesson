import React from 'react';
import { MdError } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import styles from '../styles/MonsterCardV4.module.css';

// ========================================
// 型定義
// ========================================

/**
 * モンスターの基本データ構造
 * @interface Monster
 * @property {string} name - モンスターの名前
 * @property {string[]} types - モンスターのタイプ一覧（複数可）
 * @property {string} image - モンスター画像のURL
 */
type Monster = {
    name: string;
    types: string[];
    image: string;
};

/**
 * MonsterCardV4コンポーネントのプロパティ
 * @interface MonsterCardProps
 * @property {boolean} isLoading - データ読み込み中フラグ
 * @property {string | null} error - エラーメッセージ（nullの場合はエラーなし）
 * @property {Monster | null} monster - 表示するモンスターデータ
 * @property {boolean} showSpinner - スピナー表示フラグ（遅延表示制御）
 */
type MonsterCardProps = {
    isLoading: boolean;
    error: string | null;
    monster: Monster | null;
    showSpinner: boolean;
};

// ========================================
// 定数定義
// ========================================

/** react-spinnersのカラー設定（Tailwindのblue-600に対応） */
const SPINNER_COLOR = "#2563eb";

/** react-spinnersのサイズ設定 */
const SPINNER_SIZE = 64;

/** 空状態表示用のプレースホルダーテキスト */
const PLACEHOLDER_TEXT = "準備中";

// ========================================
// ユーティリティ関数
// ========================================

/**
 * データの有効性をチェックするヘルパー関数
 * null、undefined、空文字列、空配列を無効とみなす
 * @param value - チェック対象の値（文字列、文字列配列、またはnull/undefined）
 * @returns {boolean} 有効なデータかどうか
 */
const isValidData = (value: string | string[] | undefined | null): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0 && value.some(item => item && item.trim() !== '');
    return false;
};

/**
 * モンスターデータの各フィールドの有効性をチェックする関数
 * UIの条件分岐で使用し、フィールドごとに表示/非表示を制御
 * @param monster - 検証対象のモンスターデータ
 * @returns {Object} 各フィールドの有効性を示すオブジェクト
 */
const validateMonsterData = (monster: Monster | null) => {
    if (!monster) {
        return {
            hasValidName: false,
            hasValidImage: false,
            hasValidTypes: false
        };
    }

    return {
        hasValidName: isValidData(monster.name),
        hasValidImage: isValidData(monster.image),
        hasValidTypes: isValidData(monster.types)
    };
};

// ========================================
// メインコンポーネント
// ========================================

/**
 * MonsterCardV4 - CSSモジュール版モンスターカードコンポーネント
 *
 * Tailwind版（MonsterCardVt4）を忠実に再現したCSSモジュール版。
 * 外部ライブラリ（react-icons、react-spinners）を使用してUI要素を統一。
 *
 * 主な機能：
 * - ローディング状態の表示（遅延スピナー対応）
 * - エラー状態の表示（専用アイコンと背景）
 * - 空状態の表示（プレースホルダー）
 * - モンスターデータの表示（条件付きフィールド表示）
 *
 * @param {MonsterCardProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされたモンスターカードUI
 */
const MonsterCardV4: React.FC<MonsterCardProps> = ({ isLoading, error, monster, showSpinner }) => {

    // ========================================
    // 内部コンポーネント定義
    // ========================================

    /**
     * エラーアイコンコンポーネント - react-iconsのMdErrorを使用
     * Tailwind版の w-16 h-16 mx-auto mb-2 text-red-600 と同等
     */
    const ErrorIcon: React.FC = () => (
        <div className={styles.errorIcon}>
            <MdError className={styles.errorIconSvg} />
        </div>
    );

    /**
     * ローディングスピナーコンポーネント - react-spinnersのClipLoaderを使用
     * Tailwind版のカスタムスピナーと同等の見た目を提供
     */
    const LoadingSpinner: React.FC = () => (
        <ClipLoader
            color={SPINNER_COLOR}
            loading={true}
            size={SPINNER_SIZE}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );

    // ========================================
    // 状態別レンダリング関数
    // ========================================

    /**
     * ローディング状態のUIをレンダリング
     * showSpinnerがtrueの場合のみスピナーを表示（遅延表示対応）
     */
    const renderLoadingState = () => (
        <div className={styles.container}>
            <div className={styles.cardBase}>
                <div className={styles.content}>
                    {/* ローディング中のタイトル */}
                    <h2 className={`${styles.title} ${styles.titleLoading}`}>
                        読み込み中...
                    </h2>

                    {/* スピナー表示エリア */}
                    <div className={styles.imageArea}>
                        <div className={styles.imageContainer}>
                            <LoadingSpinner />
                        </div>
                    </div>

                    {/* ローディング中の説明文 */}
                    <p className={`${styles.description} ${styles.descriptionLoading}`}>
                        データを取得しています
                    </p>
                </div>
            </div>
        </div>
    );

    /**
     * エラー状態のUIをレンダリング
     * エラー専用の背景色とアイコンを表示
     */
    const renderErrorState = () => (
        <div className={styles.container}>
            <div className={`${styles.cardBase} ${styles.cardBaseError}`}>
                <div className={styles.content}>
                    {/* エラータイトル */}
                    <h2 className={`${styles.title} ${styles.titleError}`}>
                        エラーが発生しました
                    </h2>

                    {/* エラーアイコン表示エリア */}
                    <div className={`${styles.imageArea} ${styles.imageAreaError}`}>
                        <div className={styles.imageContainer}>
                            <ErrorIcon />
                        </div>
                    </div>

                    {/* エラーメッセージ */}
                    <p className={`${styles.description} ${styles.descriptionError}`}>
                        {error}
                    </p>
                </div>
            </div>
        </div>
    );

    /**
     * 空状態（初期状態またはデータなし）のUIをレンダリング
     * データ取得中でない場合のみ、透明な状態で表示
     */
    const renderEmptyState = (isInvisible: boolean = false) => (
        <div className={styles.container}>
            <div className={styles.cardBase} style={{ opacity: isInvisible ? 0 : 1 }}>
                <div className={styles.content}>
                    {/* 空状態のタイトル */}
                    <h2 className={`${styles.title} ${styles.titleEmpty}`}>
                        {isInvisible ? "" : "データなし"}
                    </h2>

                    {/* 準備中メッセージ表示エリア */}
                    <div className={styles.imageArea}>
                        <div className={styles.imageContainer}>
                            <div className={styles.emptyText}>
                                {isInvisible ? "" : PLACEHOLDER_TEXT}
                            </div>
                        </div>
                    </div>

                    {/* 空状態の説明文 */}
                    <p className={`${styles.description} ${styles.descriptionEmpty}`}>
                        {isInvisible ? "" : "モンスターデータを取得してください"}
                    </p>
                </div>
            </div>
        </div>
    );

    /**
     * 通常のモンスターデータ表示UIをレンダリング
     * 各フィールドの有効性をチェックして条件付きレンダリング
     */
    const renderMonsterData = () => {
        const { hasValidName, hasValidImage, hasValidTypes } = validateMonsterData(monster);

        return (
            <div className={styles.container}>
                <div className={styles.cardBase}>
                    <div className={styles.content}>
                        {/* タイトル部分 - 有効な名前がある場合のみ表示 */}
                        {hasValidName ? (
                            <h2 className={`${styles.title} ${styles.titleDefault}`}>
                                {monster!.name}
                            </h2>
                        ) : (
                            <div className={styles.spacer} />
                        )}

                        {/* 画像エリア - 有効な画像がある場合のみ表示 */}
                        <div className={styles.imageArea}>
                            <div className={styles.imageContainer}>
                                {hasValidImage ? (
                                    <img
                                        src={monster!.image}
                                        alt={monster!.name}
                                        className={styles.image}
                                    />
                                ) : (
                                    <span className={styles.noImageText}>画像なし</span>
                                )}
                            </div>
                        </div>

                        {/* 説明部分 - 有効なタイプがある場合のみ表示 */}
                        {hasValidTypes ? (
                            <p className={`${styles.description} ${styles.descriptionDefault}`}>
                                {monster!.types.join("　")}
                            </p>
                        ) : (
                            <div className={styles.spacer} />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ========================================
    // メインレンダリングロジック
    // ========================================

    /**
     * 状態の優先度に基づいて適切なUIコンポーネントを選択
     * 1. ローディング状態（スピナー表示条件付き）
     * 2. エラー状態
     * 3. 空状態（データなし - データ取得中は透明表示）
     * 4. 通常状態（モンスターデータ表示）
     */

    // 1. ローディング状態（スピナー表示条件も含む）
    if (isLoading && showSpinner) {
        return renderLoadingState();
    }

    // 2. エラー状態
    if (error) {
        return renderErrorState();
    }

    // 3. 空状態（データなし）
    if (!monster) {
        // データ取得中（isLoadingがtrue）の場合は透明で表示
        const isInvisible = isLoading;
        return renderEmptyState(isInvisible);
    }

    // 4. 通常状態（モンスターデータ表示）
    return renderMonsterData();
};

export default MonsterCardV4;
