import Link from "next/link";
import { NextPageWithLayout } from "./_app";
import Layout from "../components/Layout";

const Home: NextPageWithLayout = () => {
    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
            <div className="max-w-3xl w-full p-8 bg-sky-100 rounded-lg shadow-lg">
                <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">All Pages</h1>
                <ul className="space-y-4">
                    <li>
                        <Link href="/monster-list" className="text-center block p-4 bg-white rounded shadow hover:bg-sky-200 transition">ポケモン一覧</Link>
                    </li>
                    <li>
                        <Link href="/monster-random-v4" className="text-center block p-4 bg-white rounded shadow hover:bg-sky-200 transition">ポケランダム<br/>（version4）</Link>
                    </li>
                    <li>
                        <Link href="/monster-random-vt4" className="text-center block p-4 bg-white rounded shadow hover:bg-sky-200 transition">ポケランダム<br/>（version4-tailwind）</Link>
                    </li>
                    <li>
                        <Link href="/pokemon-stats" className="text-center block p-4 bg-white rounded shadow hover:bg-sky-200 transition">ポケステータス</Link>
                    </li>
                    <li>
                        <Link href="/jsonViewer" className="text-center block p-4 bg-white rounded shadow hover:bg-sky-200 transition">JSON ビューワー</Link>
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
