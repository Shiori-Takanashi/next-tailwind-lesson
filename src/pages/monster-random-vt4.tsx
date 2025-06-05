import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import MonsterCard from "../components/MonsterCardVt4";
import ApiTestPanel, { ApiEndpoint } from "../components/ApiTestPanel";
import { Monster, validateApiResponse } from "../schemas/monster";

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

const MonsterRandomV4Page: NextPageWithLayout = () => {
    const [monster, setMonster] = useState<Monster | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [currentApi, setCurrentApi] = useState<ApiEndpoint>("normal");

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
     * @param {Function} isCancelled - キャンセル状態をチェックする関数（オプション）
     * @returns {Promise<Monster | null>} 取得されたモンスターデータまたはnull
     */
    const fetchMonsterData = async (isCancelled?: () => boolean): Promise<Monster | null> => {
        const endpoint = API_ENDPOINTS[currentApi];

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

        // 画像をプリロード - 有効な画像がある場合のみ
        if (data.image && data.image.trim() !== '') {
            await preloadImage(data.image);
        }

        // キャンセルチェック
        if (isCancelled?.()) return null;

        return data;
    };

    /**
     * ランダム更新ボタンのクリックハンドラー（Zodバリデーション＋タイムアウト付き）
     * 現在選択中のAPIエンドポイントでデータを再取得
     */
    const fetchMonster = async () => {
        console.log(`[MonsterRandomVT4] データ取得開始: ${currentApi}API（タイムアウト: ${API_TIMEOUT / 1000}秒）`);

        setIsLoading(true);
        setIsImageLoaded(false);
        setErrorMsg(null);
        setShowSpinner(false);

        const spinnerTimer = setTimeout(() => setShowSpinner(true), SPINNER_DELAY);

        try {
            const data = await fetchMonsterData();
            if (data) {
                setMonster(data);
                setIsImageLoaded(true);
                console.log(`[MonsterRandomVT4] ${currentApi}API データ取得成功:`, data);
            }
        } catch (error) {
            const errorMessage = error instanceof Error && error.message === "応答時間が遅すぎます"
                ? "応答時間が遅すぎます"
                : "不正なデータです";
            setErrorMsg(errorMessage);
            setIsImageLoaded(true);
            console.error(`[MonsterRandomVT4] ${currentApi}API エラー:`, error);
        } finally {
            clearTimeout(spinnerTimer);
            setIsLoading(false);
            setShowSpinner(false);
        }
    };

    // 初回読み込み（Zodバリデーション＋タイムアウト付き）
    useEffect(() => {
        let isCancelled = false;

        const initialFetch = async () => {
            console.log(`[MonsterRandomVT4] 初期読み込み開始: normalAPI（タイムアウト: ${API_TIMEOUT / 1000}秒）`);

            setIsLoading(true);
            setIsImageLoaded(false);
            setErrorMsg(null);

            try {
                const data = await fetchMonsterData(() => isCancelled);
                if (data) {
                    setMonster(data);
                    setIsImageLoaded(true);
                    console.log(`[MonsterRandomVT4] 初期読み込み成功:`, data);
                }
            } catch (error) {
                if (!isCancelled) {
                    const errorMessage = error instanceof Error && error.message === "応答時間が遅すぎます"
                        ? "応答時間が遅すぎます"
                        : "不正なデータです";
                    setErrorMsg(errorMessage);
                    setIsImageLoaded(true);
                    console.error(`[MonsterRandomVT4] 初期読み込みエラー:`, error);
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

    // API切り替えハンドラー（Zodバリデーション＋タイムアウト付き）
    const handleApiChange = (apiType: ApiEndpoint) => {
        console.log(`[MonsterRandomVT4] API切り替え: ${apiType}API に変更（タイムアウト: ${API_TIMEOUT / 1000}秒）`);
        setCurrentApi(apiType);
    };

    return (
        <main className="flex-1 bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 py-8 px-4">
            <div className="max-w-lg mx-auto h-full flex flex-col justify-center">
                <div className="flex justify-center mb-8">
                    <MonsterCard
                        isLoading={isLoading}
                        error={errorMsg}
                        monster={monster && isImageLoaded ? monster : null}
                        showSpinner={showSpinner}
                    />
                </div>

                <div className="flex justify-center mb-8">
                    <button
                        className={`px-10 py-4 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 ${isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                            }`}
                        onClick={fetchMonster}
                        disabled={isLoading}
                    >
                        {isLoading ? "読み込み中..." : "ランダム更新"}
                    </button>
                </div>

                {/* APIテストパネル */}
                <ApiTestPanel
                    currentApi={currentApi}
                    isLoading={isLoading}
                    onApiChange={handleApiChange}
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
                subTitle: "Version4.0 & Tailwind-CSS",
            }}
        >
            {page}
        </Layout>
    );
};

export default MonsterRandomV4Page;
