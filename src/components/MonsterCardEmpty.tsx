import styles from "../styles/MonsterCard.module.css";

export default function MonsterCardEmpty() {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.monsterName} style={{ color: "skyblue" }}>
                    データなし
                </h2>
                <div className={styles.image} style={{ backgroundColor: "skyblue" }}>
                    {/* 空の画像エリア */}
                </div>
                <p className={styles.monsterTypes} style={{ color: "skyblue" }}>
                    準備中
                </p>
            </div>
        </div>
    );
}
