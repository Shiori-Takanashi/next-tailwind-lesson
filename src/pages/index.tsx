import Link from "next/link";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";

export default function Home() {
    return (
        <main className={styles.main}>
            <Header mainTitle="Top Page" subTitle="" />
            <div className={styles.container}>
                <ul>
                    <li className={styles.listItem}>
                        <Link href="/monster-random-v1">ランダム表示（version1）</Link>
                    </li>
                    <li className={styles.listItem}>
                        <Link href="/monster-random-v2">ランダム表示（version2）</Link>
                    </li>
                </ul>
            </div>
        </main>
    );
}
