import { useEffect, useState } from "react";
import MonsterCard from "../components/MonsterCard";
import MonsterCardEmpty from "../components/MonsterCardEmpty";
import MonsterCardLoading from "../components/MonsterCardLoading";
import MonsterCardError from "../components/MonsterCardError";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import styles from "../styles/MonsterRandom.module.css";

type Monster = {
    name: string;
    types: string[];
    image: string;
};

const MonsterRandomV3Page: NextPageWithLayout = () => {
    const [monster, setMonster] = useState<Monster | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = src;
        });
    };

    const fetchMonster = async () => {
        setIsLoading(true);
        setIsImageLoaded(false);
        setErrorMsg(null);
        setShowSpinner(false);

        // 2秒後にスピナーを表示
        const spinnerTimer = setTimeout(() => {
            setShowSpinner(true);
        }, 2000);

        try {
            const res = await fetch("/api/random-monster", { cache: "no-store" });
            if (!res.ok) throw new Error(`status: ${res.status}`);
            const data: Monster = await res.json();

            // 画像をプリロード
            if (data.image) {
                await preloadImage(data.image);
            }

            setMonster(data);
            setIsImageLoaded(true);
        } catch {
            setErrorMsg("取得に失敗しました");
            setIsImageLoaded(true);
        } finally {
            clearTimeout(spinnerTimer);
            setIsLoading(false);
            setShowSpinner(false);
        }
    };

    // 初回だけ取得
    useEffect(() => {
        let isCancelled = false;

        const fetchWithCancel = async () => {
            setIsLoading(true);
            setIsImageLoaded(false);
            setErrorMsg(null);

            try {
                const res = await fetch("/api/random-monster", { cache: "no-store" });
                if (!res.ok) throw new Error(`status: ${res.status}`);
                const data: Monster = await res.json();

                // キャンセルされていない場合のみ状態を更新
                if (!isCancelled) {
                    // 画像をプリロード
                    if (data.image) {
                        await preloadImage(data.image);
                    }

                    setMonster(data);
                    setIsImageLoaded(true);
                }
            } catch {
                if (!isCancelled) {
                    setErrorMsg("取得に失敗しました");
                    setIsImageLoaded(true);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchWithCancel();

        // クリーンアップ関数でキャンセルフラグを設定
        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <main className={styles.mainArea}>
            {errorMsg ? (
                <MonsterCardError errorMessage={errorMsg} />
            ) : monster && isImageLoaded ? (
                <MonsterCard monster={monster} />
            ) : showSpinner ? (
                <MonsterCardLoading />
            ) : (
                <MonsterCardEmpty />
            )}

            <button
                className={styles.button}
                onClick={fetchMonster}
                disabled={isLoading}
            >
                ランダム更新
            </button>
        </main>
    );
};

MonsterRandomV3Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout
            showHeader={true}
            showFooter={true}
            headerProps={{
                mainTitle: "ランダム表示",
                subTitle: "version3.0",
            }}
        >
            {page}
        </Layout>
    );
};

export default MonsterRandomV3Page;
