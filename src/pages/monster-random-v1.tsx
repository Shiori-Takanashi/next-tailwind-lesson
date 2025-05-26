import { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/MonsterRandom.module.css";

type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

export default function MonsterRandomV1Page() {
  const [monster, setMonster] = useState<Monster | null>(null);

  const fetchMonster = async () => {
    const res = await fetch('/api/random-monster');
    if (res.ok) {
      const data = await res.json();
      setMonster(data);
    } else {
      console.error('取得失敗');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header mainTitle="ランダム表示" subTitle="version1.0" />
      <div className={styles.mainArea}>
        <div className={styles.displayCard}>
          {monster ? (
            <div>
              <h2 className={styles.monsterName}>{monster.name}</h2>
              <img
                src={monster.image}
                alt={monster.name}
                width={200}
                className={styles.image}
              />


              <p className={styles.monsterTypes}>{monster.types.join('　 ')}</p>
            </div>
          ) : (
            <p className={styles.placeholder}>モンスターを取得してください</p>
          )}
        </div>
      </div>
      <button className={styles.button} onClick={fetchMonster}>
        ランダム更新
      </button>
      <Footer is_top={false} />
    </div>
  );
}
