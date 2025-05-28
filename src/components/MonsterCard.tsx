import styles from "../styles/MonsterCard.module.css";

type Props = {
    monster: {
        name: string;
        types: string[];
        image: string;
    };
};

export default function MonsterCard({ monster }: Props) {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h2
                    className={styles.monsterName}
                    style={{
                        ...(monster.name === "---" && { color: "skyblue" })
                    }}
                >
                    {monster.name !== "---" && monster.name}
                </h2>
                <div
                    className={styles.image}
                    style={{
                        backgroundColor: monster.image === "---" ? "skyblue" : undefined
                    }}
                >
                    {monster.name !== "---" ? (
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
                        ...(monster.types?.[0] === "---" && { color: "skyblue" })
                    }}
                >
                    {monster.types?.[0] === "---"
                        ? "不明"
                        : monster.types.join("　")}
                </p>
            </div>
        </div>
    );
}
