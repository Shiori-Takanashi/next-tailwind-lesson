import { CSSProperties } from "react";

type HeaderProps = {
    mainTitle: string;
    subTitle: string;
};

const styles: Record<string, CSSProperties> = {
    headerMain: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBlock: "1vh",
        height: "clamp(64px, 10vh, 140px)",
        backgroundColor: "#f0f0f0",
        boxSizing: "border-box",
    },
    headerH1: {
        marginTop: "0.5rem",
        color: "#000",
        fontWeight: 500,
        fontSize: "clamp(1rem, 1.2rem, 1.5rem)",
        textAlign: "center",
    },
    headerH2: {
        margin: 0,
        color: "#000",
        fontWeight: 400,
        fontSize: "clamp(0.8rem, 0.8rem, 1.2rem)",
        textAlign: "center",
    },
};

export default function Header({ mainTitle, subTitle }: HeaderProps) {
    return (
        <header style={styles.headerMain}>
            <h1 style={styles.headerH1}>{mainTitle}</h1>
            <h2 style={styles.headerH2}>{subTitle}</h2>
        </header>
    );
}
