import styles from "../styles/Header.module.css";

type HeaderProps = {
    mainTitle: string;
    subTitle: string;
};

export default function Header({ mainTitle, subTitle }: HeaderProps) {
    return (
        <div className={styles.headerMain}>
            <h1 className={styles.headerH1}>{mainTitle}</h1>
            <h2 className={styles.headerH2}>{subTitle}</h2>
        </div>
    )
}
