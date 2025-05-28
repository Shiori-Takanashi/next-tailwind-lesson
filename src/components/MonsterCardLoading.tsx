import { ClipLoader } from "react-spinners";
import styles from "../styles/MonsterCard.module.css";

export default function MonsterCardLoading() {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.monsterName} style={{ color: "skyblue" }}>
                    {/* 空のタイトル */}
                </h2>
                <div className={styles.image} style={{ backgroundColor: "skyblue" }}>
                    <ClipLoader
                        color="#ffffff"
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
                <p className={styles.monsterTypes} style={{ color: "skyblue" }}>
                    読み込み中...
                </p>
            </div>
        </div>
    );
}
