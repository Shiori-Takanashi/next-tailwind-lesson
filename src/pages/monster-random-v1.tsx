import { useEffect, useState } from "react";
import MonsterCard from "../components/MonsterCard";
import PlaceholderMessage from "../components/PlaceholderMessage";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import { CSSProperties } from "react";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

const styles: Record<string, CSSProperties> = {
  mainArea: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  displayCard: {
    position: "relative",
    width: "clamp(260px, 40vw, 320px)",
    minHeight: "320px",
    margin: "3rem 0 1rem",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    background: "#e3f0ff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    background: "#bcceff",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
};

const MonsterRandomV1Page: NextPageWithLayout = () => {
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
    <main style={styles.mainArea}>
      <div style={styles.displayCard}>
        {monster && !isLoading ? (
          <MonsterCard monster={monster} />
        ) : (
          <PlaceholderMessage
            message={isLoading ? "読み込み中…" : errorMsg ?? "モンスターの情報はまだありません。"}
          />
        )}
      </div>

      <button
        style={styles.button}
        onClick={fetchMonster}
        disabled={isLoading}
      >
        {isLoading ? "取得中…" : "ランダム更新"}
      </button>
    </main>
  );
};

MonsterRandomV1Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout
      showHeader={true}
      showFooter={true}
      headerProps={{
        mainTitle: "ランダム表示",
        subTitle: "version1.2"
      }}
    >
      {page}
    </Layout>
  );
};

export default MonsterRandomV1Page;
