import { useState } from 'react';
import Link from "next/link";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

export default function MonsterRandomV2Page() {
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
      <h1>ランダムモンスター表示（version2.0）</h1>
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
}
