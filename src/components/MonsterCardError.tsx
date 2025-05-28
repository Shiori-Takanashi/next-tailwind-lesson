import styles from "../styles/MonsterCard.module.css";

type Props = {
    errorMessage?: string;
};

export default function MonsterCardError({ errorMessage = "取得に失敗しました" }: Props) {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.monsterName} style={{ color: "#ff6b6b" }}>
                    エラー
                </h2>
                <div className={styles.image} style={{ backgroundColor: "#ffe6e6" }}>
                    <div style={{
                        fontSize: "3rem",
                        color: "#ff6b6b",
                        fontWeight: "bold"
                    }}>
                        ⚠️
                    </div>
                </div>
                <p className={styles.monsterTypes} style={{ color: "#ff6b6b" }}>
                    {errorMessage}
                </p>
            </div>
        </div>
    );
}
