import Link from "next/link";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";
import { CSSProperties } from "react";

type Styles = {
    main: CSSProperties;
    container: CSSProperties;
    h1: CSSProperties;
    listItem: CSSProperties;
};

const styles: Styles = {
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "0 2rem",
    },
    container: {
        maxWidth: "800px",
        width: "80%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(205, 242, 255)",
    },
    h1: {
        color: "#000000",
        fontSize: "2.5rem",
        margin: "2rem 0",
        fontWeight: 500,
    },
    listItem: {
        marginBottom: "1rem",
    },
};

const Home: NextPageWithLayout = () => {
    return (
        <main style={styles.main}>
            <div style={styles.container}>
                <ul>
                    <li style={styles.listItem}>
                        <Link href="/monster-random-v1">ランダム表示（version1）</Link>
                    </li>
                    <li style={styles.listItem}>
                        <Link href="/monster-random-v2">ランダム表示（version2）</Link>
                    </li>
                    <li style={styles.listItem}>
                        <Link href="/monster-random-v3">ランダム表示（version3）</Link>
                    </li>
                </ul>
            </div>
        </main>
    );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout
            showHeader={true}
            showFooter={false}
            headerProps={{
                mainTitle: "Top Page",
                subTitle: ""
            }}
        >
            {page}
        </Layout>
    );
};

export default Home;
