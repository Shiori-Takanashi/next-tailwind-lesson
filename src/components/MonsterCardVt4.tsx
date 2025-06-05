import React from 'react';
import { MdError } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';

// ========================================
// 型定義
// ========================================

type Monster = {
    name: string;
    types: string[];
    image: string;
};

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
 */
const isValidData = (
    value: string | string[] | undefined | null
): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
        return value.trim() !== '';
    }
    if (Array.isArray(value)) {
        return (
            value.length > 0 &&
            value.some((item) => item && item.trim() !== '')
        );
    }
    return false;
};

/**
 * モンスターデータの各フィールドの有効性をチェック
 */
const validateMonsterData = (monster: Monster | null) => {
    if (!monster) {
        return {
            hasValidName: false,
            hasValidImage: false,
            hasValidTypes: false,
        };
    }

    return {
        hasValidName: isValidData(monster.name),
        hasValidImage: isValidData(monster.image),
        hasValidTypes: isValidData(monster.types),
    };
};

// ========================================
// メインコンポーネント
// ========================================

const MonsterCard: React.FC<MonsterCardProps> = ({
    isLoading,
    error,
    monster,
    showSpinner,
}) => {
    // ========================================
    // Tailwindスタイル定義 - CSS Gridを使用した最適化レイアウト
    // ========================================

    const cardStyles = {
        container: `
      w-full
      max-w-md
      mx-auto
    `,
        cardBase: `
      border-2
      border-blue-200
      rounded-2xl
      shadow-xl
      p-4
      hover:shadow-2xl
      transition-all
      duration-300
      bg-gradient-to-br
      from-blue-50
      to-indigo-50
    `,
        content: `
      grid
      grid-rows-[auto_200px_auto]
      gap-4
      h-full
      min-h-[300px]
    `,
        title: `
      text-2xl
      font-bold
      text-center
      min-h-[1.5rem]
      flex
      items-center
      justify-center
    `,
        imageArea: `
      relative
      rounded-xl
      overflow-hidden
      w-[200px]
      h-[200px]
      mx-auto
      bg-gradient-to-br
      from-blue-50
      to-indigo-50
    `,
        description: `
      text-lg
      font-medium
      text-center
      min-h-[1.5rem]
      flex
      items-center
      justify-center
    `,
    };

    // ========================================
    // 内部コンポーネント定義
    // ========================================

    /**
     * エラーアイコンコンポーネント - react-iconsのMdErrorを使用
     */
    const ErrorIcon: React.FC = () => (
        <div
            className={`
        text-red-600
        text-center
      `}
        >
            <MdError
                className={`
          w-16
          h-16
          mx-auto
          mb-2
        `}
            />
        </div>
    );

    /**
     * ローディングスピナーコンポーネント - react-spinnersのClipLoaderを使用
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
        <div className={cardStyles.container.trim()}>
            <div
                className={cardStyles.cardBase.trim()}
                style={{ aspectRatio: '4/3' }}
            >
                <div className={cardStyles.content.trim()}>
                    {/* ローディング中のタイトル */}
                    <h2
                        className={`
              ${cardStyles.title.trim()}
              text-blue-700
            `}
                    >
                        読み込み中...
                    </h2>

                    {/* スピナー表示エリア */}
                    <div className={cardStyles.imageArea.trim()}>
                        <div
                            className={`
                w-full
                h-full
                flex
                items-center
                justify-center
              `}
                        >
                            <LoadingSpinner />
                        </div>
                    </div>

                    {/* ローディング中の説明文 */}
                    <p
                        className={`
              ${cardStyles.description.trim()}
              text-blue-600
            `}
                    >
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
        <div className={cardStyles.container.trim()}>
            <div
                className={`
          ${cardStyles.cardBase.trim()}
          bg-gradient-to-br
          from-red-50
          to-red-100
        `}
                style={{ aspectRatio: '4/3' }}
            >
                <div className={cardStyles.content.trim()}>
                    {/* エラータイトル */}
                    <h2
                        className={`
              ${cardStyles.title.trim()}
              text-red-700
            `}
                    >
                        エラーが発生しました
                    </h2>

                    {/* エラーアイコン表示エリア */}
                    <div
                        className={`
              ${cardStyles.imageArea.trim()}
              bg-gradient-to-br
              from-red-50
              to-red-100
            `}
                    >
                        <div
                            className={`
                w-full
                h-full
                flex
                items-center
                justify-center
              `}
                        >
                            <ErrorIcon />
                        </div>
                    </div>

                    {/* エラーメッセージ */}
                    <p
                        className={`
              ${cardStyles.description.trim()}
              text-red-600
            `}
                    >
                        {error}
                    </p>
                </div>
            </div>
        </div>
    );

    /**
     * 空状態（初期状態またはデータなし）のUIをレンダリング
     * データ取得中でない場合のみ表示
     */
    const renderEmptyState = (isInvisible: boolean = false) => (
        <div className={cardStyles.container.trim()}>
            <div
                className={cardStyles.cardBase.trim()}
                style={{
                    aspectRatio: '4/3',
                    opacity: isInvisible ? 0 : 1,
                }}
            >
                <div className={cardStyles.content.trim()}>
                    {/* 空状態のタイトル */}
                    <h2
                        className={`
              ${cardStyles.title.trim()}
              text-sky-700
            `}
                    >
                        {isInvisible ? "" : "データなし"}
                    </h2>

                    {/* 準備中メッセージ表示エリア */}
                    <div className={cardStyles.imageArea.trim()}>
                        <div
                            className={`
                w-full
                h-full
                flex
                items-center
                justify-center
              `}
                        >
                            <div
                                className={`
                  text-sky-600
                  text-2xl
                  font-medium
                `}
                            >
                                {isInvisible ? "" : PLACEHOLDER_TEXT}
                            </div>
                        </div>
                    </div>

                    {/* 空状態の説明文 */}
                    <p
                        className={`
              ${cardStyles.description.trim()}
              text-sky-600
            `}
                    >
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
        const { hasValidName, hasValidImage, hasValidTypes } =
            validateMonsterData(monster);

        return (
            <div className={cardStyles.container.trim()}>
                <div
                    className={cardStyles.cardBase.trim()}
                    style={{ aspectRatio: '4/3' }}
                >
                    <div className={cardStyles.content.trim()}>
                        {/* タイトル部分 - 有効な名前がある場合のみ表示 */}
                        {hasValidName ? (
                            <h2
                                className={`
                  ${cardStyles.title.trim()}
                  text-slate-800
                `}
                            >
                                {monster!.name}
                            </h2>
                        ) : (
                            <div className="min-h-[1.5rem]" />
                        )}

                        {/* 画像エリア - 有効な画像がある場合のみ表示 */}
                        <div className={cardStyles.imageArea.trim()}>
                            <div
                                className={`
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                `}
                            >
                                {hasValidImage ? (
                                    <img
                                        src={monster!.image}
                                        alt={monster!.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span
                                        className={`
                      text-sky-700
                      text-sm
                      font-medium
                    `}
                                    >
                                        画像なし
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 説明部分 - 有効なタイプがある場合のみ表示 */}
                        {hasValidTypes ? (
                            <p
                                className={`
                  ${cardStyles.description.trim()}
                  text-indigo-700
                `}
                            >
                                {monster!.types.join("　")}
                            </p>
                        ) : (
                            <div className="min-h-[1.5rem]" />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ========================================
    // メインレンダリングロジック
    // ========================================

    // 優先度順に状態をチェックして適切なUIを返す

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

export default MonsterCard;
