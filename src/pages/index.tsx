import Link from "next/link";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
            <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    JSON Viewer
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    ポケモンAPIデータを美しく表示するJSONビューワー
                </p>
                <div className="text-center">
                    <Link 
                        href="/jsonViewer" 
                        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        JSON ビューワーを開く
                    </Link>
                </div>
                <div className="mt-8 text-sm text-gray-500 text-center">
                    <p>• Species, Pokemon, Forms データの表示</p>
                    <p>• ダーク/ライトテーマ対応</p>
                    <p>• エラーハンドリング</p>
                </div>
            </div>
        </main>
    );
};

// このページではレイアウトを外す
Home.getLayout = (page) => page;

export default Home;
