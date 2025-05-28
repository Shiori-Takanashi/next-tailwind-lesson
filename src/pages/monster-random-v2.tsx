import { useState } from 'react';
import Link from "next/link";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

const MonsterRandomV2Page: NextPageWithLayout = () => {
  const [monster, setMonster] = useState<Monster | null>(null);

  const fetchMonster = async () => {
    const id = Math.floor(Math.random() * 10) + 1;
    const res = await fetch(`/api/monster/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMonster(data);
    } else {
      console.error('取得失敗');
    }
  };

  return (
    <div>
      {monster && (
        <div>
          <h2>{monster.name}</h2>
          <p>{monster.types.join(', ')}</p>
          <img src={monster.image} alt={monster.name} width={200} />
        </div>
      )}
      <button onClick={fetchMonster}>ランダム更新</button>
      <div><Link href="/">トップへ</Link></div>
    </div>
  );
};

MonsterRandomV2Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout
      showHeader={true}
      showFooter={true}
      headerProps={{
        mainTitle: "ランダムモンスター表示",
        subTitle: "version2.0"
      }}
    >
      {page}
    </Layout>
  );
};

export default MonsterRandomV2Page;
