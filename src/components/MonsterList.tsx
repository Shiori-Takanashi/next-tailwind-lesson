import React from 'react';
import Image from 'next/image';
import { Monster } from '../types/monster';
import styles from '../styles/MonsterList.module.css';

interface MonsterCardProps {
    monster: Monster;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster }) => {
    const getTypeColor = (type: string): string => {
        const typeColors: { [key: string]: string } = {
            '草': '#78C850',
            '毒': '#A040A0',
            '炎': '#F08030',
            '水': '#6890F0',
            '虫': '#A8B820',
            '飛': '#A890F0',
            '電': '#F8D030',
            '超': '#F85888',
            '氷': '#98D8D8',
            '竜': '#7038F8',
            '悪': '#705848',
            '闘': '#C03028',
            '地': '#E0C068',
            '岩': '#B8A038',
            '鋼': '#B8B8D0',
            '妖': '#EE99AC',
            '霊': '#705898',
            '普': '#A8A878'
        };
        return typeColors[type] || '#68A090';
    };

    return (
        <div className={styles.monsterCard}>
            <div className={styles.imageContainer}>
                <Image
                    src={monster.image}
                    alt={monster.name}
                    width={150}
                    height={150}
                    className={styles.monsterImage}
                    unoptimized
                />
            </div>
            <div className={styles.monsterInfo}>
                <div className={styles.monsterId}>No. {monster.id.toString().padStart(3, '0')}</div>
                <h3 className={styles.monsterName}>{monster.name}</h3>
                <div className={styles.typeContainer}>
                    {monster.types.map((type, index) => (
                        <span
                            key={index}
                            className={styles.typeTag}
                            style={{ backgroundColor: getTypeColor(type) }}
                        >
                            {type}
                        </span>
                    ))}
                </div>
                <div className={styles.statsContainer}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>HP</span>
                        <span className={styles.statValue}>{monster.stats[0]}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>攻撃</span>
                        <span className={styles.statValue}>{monster.stats[1]}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>防御</span>
                        <span className={styles.statValue}>{monster.stats[2]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MonsterListProps {
    monsters: Monster[];
}

const MonsterList: React.FC<MonsterListProps> = ({ monsters }) => {
    return (
        <div className={styles.monsterGrid}>
            {monsters.map((monster) => (
                <MonsterCard key={monster.id} monster={monster} />
            ))}
        </div>
    );
};

export default MonsterList;
