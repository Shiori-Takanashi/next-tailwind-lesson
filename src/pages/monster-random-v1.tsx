import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MonsterCard from "../components/MonsterCard";
import PlaceholderMessage from "../components/PlaceholderMessage";
import styles from "../styles/MonsterRandom.module.css";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

export default function MonsterRandomV1Page() {
  const [monster, setMonster] = useState<Monster | null>(null);
  const [isFetching, setFetch] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 多重リクエスト防止
  const lockRef = useRef(false);

  const fetchMonster = useCallback(async () => {
    if (lockRef.current) return;
    lockRef.current = true;
    setFetch(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/random-monster", { cache: "no-store" });
      if (!res.ok) throw new Error(`status: ${res.status}`);
      const data: Monster = await res.json();
      setMonster(data);              // 完了後にのみ上書き
    } catch {
      setErrorMsg("取得に失敗しました");
    } finally {
      setFetch(false);
      lockRef.current = false;
    }
  }, []);

  // 初回だけ取得
  useEffect(() => {
    fetchMonster();
  }, [fetchMonster]);

  const showPlaceholder = monster === null;

  return (
    <div className={styles.wrapper}>
      <Header mainTitle="ランダム表示" subTitle="version1.2" />

      <main className={styles.mainArea}>
        <div className={styles.displayCard}>
          {showPlaceholder ? (
            <PlaceholderMessage
              message={isFetching ? "読み込み中…" : errorMsg ?? "モンスターの情報はまだありません。"}
            />
          ) : (
            <>
              <MonsterCard monster={monster} />
              {isFetching && <div className={styles.loadingOverlay} />}
            </>
          )}
        </div>

        <button
          className={styles.button}
          onClick={fetchMonster}
          disabled={isFetching}
        >
          {isFetching ? "取得中…" : "ランダム更新"}
        </button>
      </main>

      <Footer />
    </div>
  );
}
