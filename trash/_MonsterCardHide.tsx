import { CSSProperties } from "react";

type Props = {
    monster: {
        name: string;
        types: string[];
        image: string;
    };
};

const styles: Record<string, CSSProperties> = {
    content: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        userSelect: "none",
        visibility: "hidden",
    },
    monsterName: {
        fontSize: "1.5rem",
        fontWeight: 700,
        marginBottom: "0.5rem",
        userSelect: "none",
        visibility: "hidden",
    },
    image: {
        marginTop: "1rem",
        userSelect: "none",
        visibility: "hidden",
    },
    monsterTypes: {
        fontSize: "1.2rem",
        fontWeight: 700,
        color: "#8a72ff",
        marginTop: "1rem",
        userSelect: "none",
        visibility: "hidden",
    },
};

export default function MonsterCardHide({ monster }: Props) {
    return (
        <>
            <div style={styles.content}>
                <h2 style={styles.monsterName}>{monster.name}</h2>

                <img
                    src={monster.image}
                    alt={monster.name}
                    width={200}
                    height={200}
                    style={styles.image}
                />

                <p style={styles.monsterTypes}>{monster.types.join("　")}</p>
            </div>
        </>
    );
}
