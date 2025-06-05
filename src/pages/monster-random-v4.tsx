import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import MonsterCardV4 from "../components/MonsterCardV4";
import ApiTestPanel, { ApiEndpoint } from "../components/ApiTestPanel";
import { Monster, validateApiResponse } from "../schemas/monster";
import styles from "../styles/monster-random-v4.module.css";

// ========================================
// 定数定義
// ========================================

/** スピナー表示の遅延時間（ミリ秒） - UX向上のための遅延表示 */
const SPINNER_DELAY = 2000;

/** APIタイムアウト時間（ミリ秒） - 7秒でタイムアウト */
const API_TIMEOUT = 7000;

/** 使用可能なAPIエンドポイントの定義 */
const API_ENDPOINTS = {
    normal: "/api/random-monster",
    delay: "/api/random-monster-delay",
    invalid: "/api/random-monster-invalid",
    "invalid-delay": "/api/random-monster-invalid-delay",
    timeout: "/api/random-monster-timeout"
} as const;

// ========================================
// メインコンポーネント
// ========================================

/**
 * MonsterRandomV4Page - CSSモジュール版ランダムモンスター表示ページ
 *
 * Tailwind版（monster-random-vt4.tsx）を忠実に再現したCSSモジュール版。
 *
 * 主な機能：
 * - ランダムモンスターの取得と表示
 * - 遅延スピナー表示（2秒後）
 * - 画像プリロード機能
 * - エラーハンドリング
 * - キャンセル可能な初期読み込み
 *
 * @returns {JSX.Element} レンダリングされたページコンポーネント
 */
const MonsterRandomV4Page: NextPageWithLayout = () => {    // ========================================
    // 状態管理
    // ========================================

    /** 現在表示中のモンスターデータ */
    const [monster, setMonster] = useState<Monster | null>(null);

    /** データ読み込み中フラグ */
    const [isLoading, setIsLoading] = useState(false);

    /** エラーメッセージ（nullの場合はエラーなし） */
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /** 画像読み込み完了フラグ - 画像プリロード制御用 */
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    /** スピナー表示フラグ - 遅延表示制御用 */
    const [showSpinner, setShowSpinner] = useState(false);

    /** 現在選択中のAPIエンドポイント */
    const [currentApi, setCurrentApi] = useState<ApiEndpoint>("normal");

    // ========================================
    // ユーティリティ関数
    // ========================================

    /**
     * 画像のプリロード処理
     * モンスター画像を事前に読み込んで表示の瞬間的な遅延を防ぐ
     * @param {string} src - プリロードする画像のURL
     * @returns {Promise<void>} プリロード完了を示すPromise
     */
    const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = src;
        });
    };

    /**
     * タイムアウト機能付きFetch
     * @param {string} url - リクエストURL
     * @param {number} timeout - タイムアウト時間（ミリ秒）
     * @returns {Promise<Response>} レスポンス
     */
    const fetchWithTimeout = async (url: string, timeout: number = API_TIMEOUT): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                cache: "no-store",
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error("応答時間が遅すぎます");
            }
            throw error;
        }
    };

    /**
     * 共通のモンスターデータ取得ロジック（Zodバリデーション付き）
     * APIからデータを取得し、Zodでバリデーション後、有効な画像があれば事前読み込みを実行
     * @param {ApiEndpoint} apiType - 使用するAPIエンドポイントのタイプ
     * @param {Function} isCancelled - キャンセル状態をチェックする関数（オプション）
     * @returns {Promise<Monster | null>} 取得されたモンスターデータまたはnull
     */
    const fetchMonsterData = async (apiType: ApiEndpoint = "normal", isCancelled?: () => boolean): Promise<Monster | null> => {
        const endpoint = API_ENDPOINTS[apiType];

        // タイムアウト付きでAPI呼び出し
        const res = await fetchWithTimeout(endpoint, API_TIMEOUT);

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }

        // レスポンスをJSONとしてパース
        const rawData = await res.json();

        // Zodでバリデーション
        const validationResult = validateApiResponse(rawData);

        if (!validationResult.success) {
            throw new Error(validationResult.error || 'データバリデーションに失敗しました');
        }

        const data = validationResult.data!;

        // 有効な画像がある場合のみプリロードを実行
        // 空文字列やnullの場合はプリロードをスキップ
        if (data.image && data.image.trim() !== '') {
            await preloadImage(data.image);
        }

        // 処理中にキャンセルされた場合はnullを返す
        if (isCancelled?.()) return null;

        return data;
    };

    // ========================================
    // イベントハンドラー
    // ========================================

    /**
     * 指定されたAPIエンドポイントでモンスターデータを取得（Zodバリデーション＋タイムアウト付き）
     * @param {ApiEndpoint} apiType - 使用するAPIのタイプ
     */
    const fetchMonsterWithApi = async (apiType: ApiEndpoint) => {
        console.log(`[MonsterRandomV4] API切り替え: ${apiType}API を使用（タイムアウト: ${API_TIMEOUT / 1000}秒）`);

        setCurrentApi(apiType);

        // 状態を初期化
        setIsLoading(true);
        setIsImageLoaded(false);
        setErrorMsg(null);
        setShowSpinner(false);

        // スピナー表示タイマー
        const spinnerTimer = setTimeout(() => setShowSpinner(true), SPINNER_DELAY);

        try {
            const data = await fetchMonsterData(apiType);
            if (data) {
                setMonster(data);
                setIsImageLoaded(true);
                console.log(`[MonsterRandomV4] ${apiType}API データ取得成功:`, data);
            }
        } catch (error) {
            const errorMessage = error instanceof Error && error.message === "応答時間が遅すぎます"
                ? "応答時間が遅すぎます"
                : "不正なデータです";
            setErrorMsg(errorMessage);
            setIsImageLoaded(true);
            console.error(`[MonsterRandomV4] ${apiType}API エラー:`, error);
        } finally {
            clearTimeout(spinnerTimer);
            setIsLoading(false);
            setShowSpinner(false);
        }
    };

    // ========================================
    // 副作用（Effects）
    // ========================================

    /**
     * コンポーネント初回マウント時の処理（Zodバリデーション＋タイムアウト付き）
     * キャンセル可能な初期データ読み込みを実行
     */
    useEffect(() => {
        let isCancelled = false;

        const initialFetch = async () => {
            console.log(`[MonsterRandomV4] 初期読み込み開始: normalAPI（タイムアウト: ${API_TIMEOUT / 1000}秒）`);

            setIsLoading(true);
            setIsImageLoaded(false);
            setErrorMsg(null);

            try {
                const data = await fetchMonsterData("normal", () => isCancelled);
                if (data) {
                    setMonster(data);
                    setIsImageLoaded(true);
                    console.log(`[MonsterRandomV4] 初期読み込み成功:`, data);
                }
            } catch (error) {
                if (!isCancelled) {
                    const errorMessage = error instanceof Error && error.message === "応答時間が遅すぎます"
                        ? "応答時間が遅すぎます"
                        : "不正なデータです";
                    setErrorMsg(errorMessage);
                    setIsImageLoaded(true);
                    console.error(`[MonsterRandomV4] 初期読み込みエラー:`, error);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        initialFetch();
        return () => { isCancelled = true; };
    }, []);

    // ========================================
    // レンダリング
    // ========================================

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* モンスターカード表示エリア */}
                <div className={styles.cardContainer}>
                    <MonsterCardV4
                        isLoading={isLoading}
                        error={errorMsg}
                        monster={monster && isImageLoaded ? monster : null}
                        showSpinner={showSpinner}
                    />
                </div>
                {/* API選択・テストエリア */}
                <ApiTestPanel
                    currentApi={currentApi}
                    isLoading={isLoading}
                    onApiChange={fetchMonsterWithApi}
                    title="API エンドポイント テスト"
                    visible={true}
                />
            </div>
        </main>
    );
};

MonsterRandomV4Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout
            showHeader={true}
            showFooter={true}
            headerProps={{
                mainTitle: "ランダム表示",
                subTitle: "Version4.0 & CSS-Modules",
            }}
        >
            {page}
        </Layout>
    );
};

export default MonsterRandomV4Page;
