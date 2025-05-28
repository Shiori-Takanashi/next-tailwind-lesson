import { useEffect, useState } from "react";
import MonsterCard from "../components/MonsterCard";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import styles from "../styles/MonsterRandom.module.css";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

const MonsterRandomV2Page: NextPageWithLayout = () => {
  const [monster, setMonster] = useState<Monster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMonster = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/random-monster", { cache: "no-store" });
      if (!res.ok) throw new Error(`status: ${res.status}`);
      const data: Monster = await res.json();
      setMonster(data);
    } catch {
      setErrorMsg("取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 初回だけ取得
  useEffect(() => {
    fetchMonster();
  }, []);

  return (
    <main className={styles.mainArea}>
      <MonsterCard
        monster={monster || {
          id: 0,
          name: "---",
          types: ["---"],
          image: "---"
        }}
      />

      <button
        className={styles.button}
        onClick={fetchMonster}
        disabled={isLoading}
      >
        <span style={{ visibility: isLoading ? "hidden" : "visible" }}>
          ランダム更新
        </span>
      </button>
    </main>
  );
};

MonsterRandomV2Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout
      showHeader={true}
      showFooter={true}
      headerProps={{
        mainTitle: "ランダム表示",
        subTitle: "version2.0",
      }}
    >
      {page}
    </Layout>
  );
};

export default MonsterRandomV2Page;
