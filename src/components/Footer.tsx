import Link from "next/link";
import styles from "../styles/Footer.module.css";

type FooterProps = {
    is_top: boolean;
};

export default function Footer({ is_top }: FooterProps) {
    return (
        <div className={styles.footerMain}>
            <div className={styles.backLink}>
                <Link href="/">トップへ</Link>
            </div>
            <div className={styles.footerText}>
                <p>© 2023 Monster Random Display</p>
            </div>
        </div>
    )
}
