import React from 'react';
import styles from '../styles/api-test-panel.module.css';

// ========================================
// 型定義
// ========================================

/** APIエンドポイントのタイプ定義 */
export type ApiEndpoint = "normal" | "delay" | "invalid" | "invalid-delay" | "timeout";

/** APIテストパネルのプロパティ */
type ApiTestPanelProps = {
    /** 現在選択中のAPIエンドポイント */
    currentApi: ApiEndpoint;
    /** データ読み込み中フラグ */
    isLoading: boolean;
    /** API切り替え時のコールバック関数 */
    onApiChange: (apiType: ApiEndpoint) => void;
    /** パネルのタイトル（オプション） */
    title?: string;
    /** パネルを表示するかどうか（オプション、デフォルト: true） */
    visible?: boolean;
};

// ========================================
// 定数定義
// ========================================

/** APIエンドポイントの表示名マッピング */
const API_DISPLAY_NAMES: Record<ApiEndpoint, string> = {
    normal: "通常",
    delay: "遅延",
    invalid: "不正",
    "invalid-delay": "遅延不正",
    timeout: "超遅延",
};

/** APIボタンの設定情報 */
const API_BUTTON_CONFIG: Record<ApiEndpoint, {
    label: string;
    styleClass: string;
    description: string;
}> = {
    normal: {
        label: "通常",
        styleClass: styles.testButtonNormal,
        description: "即座に正常なデータを返します"
    },
    delay: {
        label: "遅延",
        styleClass: styles.testButtonDelay,
        description: "5秒後に正常なデータを返します"
    },
    invalid: {
        label: "不正",
        styleClass: styles.testButtonInvalid,
        description: "即座に不正なデータを返します"
    },
    "invalid-delay": {
        label: "遅延不正",
        styleClass: styles.testButtonInvalidDelay,
        description: "5秒後に不正なデータを返します"
    },
    timeout: {
        label: "超遅延",
        styleClass: styles.testButtonTimeout,
        description: "8秒待機してタイムアウトをテストします"
    }
};

// ========================================
// メインコンポーネント
// ========================================

/**
 * ApiTestPanel - APIエンドポイントテスト用コンポーネント
 *
 * 複数のAPIエンドポイントを切り替えてテストするためのUI要素を提供。
 *
 * 主な機能：
 * - 4つのAPIエンドポイント（通常、遅延、不正データ、遅延不正データ）の切り替え
 * - 現在選択中のAPIの表示
 * - ローディング状態に応じたボタンの無効化
 * - 各APIの説明とステータス表示
 *
 * @param {ApiTestPanelProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element | null} レンダリングされたAPIテストパネル
 */
const ApiTestPanel: React.FC<ApiTestPanelProps> = ({
    currentApi,
    isLoading,
    onApiChange,
    title = "API エンドポイント テスト",
    visible = true
}) => {
    // パネルが非表示の場合は何もレンダリングしない
    if (!visible) {
        return null;
    }

    /**
     * APIボタンのクリックハンドラー
     * @param {ApiEndpoint} apiType - 選択されたAPIタイプ
     */
    const handleApiButtonClick = (apiType: ApiEndpoint) => {
        if (!isLoading) {
            onApiChange(apiType);
        }
    };

    /**
     * APIボタンの表示情報を生成
     * @param {ApiEndpoint} apiType - APIタイプ
     * @returns {JSX.Element} APIボタン要素
     */
    const renderApiButton = (apiType: ApiEndpoint) => {
        const config = API_BUTTON_CONFIG[apiType];
        const isActive = currentApi === apiType;

        return (
            <button
                key={apiType}
                className={`
                    ${styles.testButton}
                    ${config.styleClass}
                    ${isActive ? styles.testButtonActive : ""}
                `}
                onClick={() => handleApiButtonClick(apiType)}
                disabled={isLoading}
                title={config.description}
                aria-label={`${config.label}を選択`}
            >
                {config.label}
            </button>
        );
    };

    return (
        <div className={styles.apiTestSection}>
            {/* APIテストボタン群 */}
            <div className={styles.testButtonContainer}>
                {(Object.keys(API_BUTTON_CONFIG) as ApiEndpoint[]).map(renderApiButton)}
            </div>


        </div>
    );
};

export default ApiTestPanel;
