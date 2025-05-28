import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
    footerMain: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "clamp(64px, 15vh, 160px)",
        paddingBlock: "clamp(1rem, 2vw, 3rem)",
        backgroundColor: "#f0f0f0",
        boxSizing: "border-box",
    },
    backLink: {
        padding: "clamp(0.2rem, 2vw, 0.3rem) clamp(0.5rem, 3vw, 0.5rem)",
        fontSize: "clamp(0.5rem, 1vw, 1rem)",
        backgroundColor: "rgb(209, 209, 209)",
        borderRadius: "3px",
        cursor: "pointer",
        textAlign: "center",
    },
    footerText: {
        color: "#000000",
        fontSize: "clamp(0.5rem, 0.8vw, 1rem)",
        fontWeight: 500,
    },
};

export default function Footer() {
    const router = useRouter();
    const isRoot = router.pathname === "/";

    return (
        <footer style={styles.footerMain}>
            {!isRoot && (
                <div style={styles.backLink}>
                    <Link href="/">トップへ</Link>
                </div>
            )}
            <div style={styles.footerText}>
                <p>© 2023 Monster Random Display</p>
            </div>
        </footer>
    );
}
