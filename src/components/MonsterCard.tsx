import styles from "../styles/MonsterCard.module.css";

type Props = {
    monster: {
        name: string;
        types: string[];
        image: string;
    };
};

/**
 * データの有効性をチェックするヘルパー関数
 * null、undefined、空文字列、マジックストリング "---" を無効とみなす
 */
const isValidData = (value: string | string[] | undefined | null): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '' && value !== '---';
    if (Array.isArray(value)) return value.length > 0 && value.some(item => item && item.trim() !== '' && item !== '---');
    return false;
};

export default function MonsterCard({ monster }: Props) {
    const hasValidName = isValidData(monster.name);
    const hasValidImage = isValidData(monster.image);
    const hasValidTypes = isValidData(monster.types);

    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h2
                    className={styles.monsterName}
                    style={{
                        ...(!hasValidName && { color: "skyblue" })
                    }}
                >
                    {hasValidName ? monster.name : "名前不明"}
                </h2>
                <div
                    className={styles.image}
                    style={{
                        backgroundColor: !hasValidImage ? "skyblue" : undefined
                    }}
                >
                    {hasValidImage ? (
                        <img
                            src={monster.image}
                            alt={monster.name}
                            width={200}
                            height={200}
                            style={{ display: "block" }}
                        />
                    ) : (
                        <div style={{ width: "200px", height: "200px" }} />
                    )}
                </div>

                <p
                    className={styles.monsterTypes}
                    style={{
                        ...(!hasValidTypes && { color: "skyblue" })
                    }}
                >
                    {hasValidTypes ? monster.types.join("　") : "タイプ不明"}
                </p>
            </div>
        </div>
    );
}
