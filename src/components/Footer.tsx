import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Footer.module.css";

export default function Footer() {
    const router = useRouter();
    const isRoot = router.pathname === "/";

    return (
        <footer className={styles.footerMain}>
            {!isRoot && (
                <div className={styles.backLink}>
                    <Link href="/">トップへ</Link>
                </div>
            )}
            <div className={styles.footerText}>
                <p style={{ margin: 0 }}>© 2023 Monster Random Display</p>
            </div>
        </footer>
    );
}
