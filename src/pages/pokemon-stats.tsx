import React, { useState, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Monster } from '../types/monster';
import { NextPageWithLayout } from './_app';
import Layout from '../components/Layout';
import fs from 'fs/promises';
import path from 'path';

interface PokemonStatsPageProps {
    monsters: Monster[];
}

const PokemonStatsPage: NextPageWithLayout<PokemonStatsPageProps> = ({ monsters }) => {
    const [sortBy, setSortBy] = useState<'id' | 'hp' | 'attack' | 'defense' | 'sp_attack' | 'sp_defense' | 'speed' | 'total'>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // 種族値の合計を計算
    const monstersWithTotal = useMemo(() => {
        return monsters.map(monster => ({
            ...monster,
            total: monster.stats.reduce((sum, stat) => sum + stat, 0)
        }));
    }, [monsters]);

    // フィルタリングとソート
    const filteredAndSortedMonsters = useMemo(() => {
        let filtered = monstersWithTotal.filter(monster =>
            monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            monster.id.toString().includes(searchTerm)
        );

        // ソート
        filtered.sort((a, b) => {
            let valueA: number, valueB: number;

            switch (sortBy) {
                case 'id':
                    valueA = a.id;
                    valueB = b.id;
                    break;
                case 'hp':
                    valueA = a.stats[0];
                    valueB = b.stats[0];
                    break;
                case 'attack':
                    valueA = a.stats[1];
                    valueB = b.stats[1];
                    break;
                case 'defense':
                    valueA = a.stats[2];
                    valueB = b.stats[2];
                    break;
                case 'sp_attack':
                    valueA = a.stats[3];
                    valueB = b.stats[3];
                    break;
                case 'sp_defense':
                    valueA = a.stats[4];
                    valueB = b.stats[4];
                    break;
                case 'speed':
                    valueA = a.stats[5];
                    valueB = b.stats[5];
                    break;
                case 'total':
                    valueA = a.total;
                    valueB = b.total;
                    break;
                default:
                    valueA = a.id;
                    valueB = b.id;
            }

            if (sortOrder === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });

        return filtered;
    }, [monstersWithTotal, searchTerm, sortBy, sortOrder]);

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (column: typeof sortBy) => {
        if (sortBy !== column) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <>
            <Head>
                <title>ポケモン種族値一覧 - Monster Random</title>
                <meta name="description" content="全ポケモンの種族値を一覧表示。ソート・検索機能付き。" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="py-8">
                {/* 検索・操作パネル */}
                <div className="max-w-6xl mx-auto mb-8 px-4">
                    <div className="bg-white rounded-xl p-6 shadow-md mb-4">
                        <div className="flex gap-4 items-center flex-wrap justify-center">
                            <input
                                type="text"
                                placeholder="ポケモン名またはIDで検索"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-3 border-2 border-slate-300 rounded-lg text-base min-w-[300px] transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                            />
                            <div className="text-slate-500 text-sm">
                                {filteredAndSortedMonsters.length}体表示中
                            </div>
                        </div>
                    </div>
                </div>

                {/* 種族値テーブル */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-slate-200 border-b-2 border-slate-200">
                                        <th
                                            onClick={() => handleSort('id')}
                                            className="p-4 text-left font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            ID {getSortIcon('id')}
                                        </th>
                                        <th className="p-4 text-left font-semibold border-r border-slate-200">
                                            名前
                                        </th>
                                        <th className="p-4 text-left font-semibold border-r border-slate-200">
                                            タイプ
                                        </th>
                                        <th
                                            onClick={() => handleSort('hp')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            HP {getSortIcon('hp')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('attack')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            攻撃 {getSortIcon('attack')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('defense')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            防御 {getSortIcon('defense')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('sp_attack')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            特攻 {getSortIcon('sp_attack')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('sp_defense')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            特防 {getSortIcon('sp_defense')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('speed')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap border-r border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            素早 {getSortIcon('speed')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('total')}
                                            className="p-4 text-center font-semibold cursor-pointer select-none whitespace-nowrap hover:bg-slate-100 transition-colors"
                                        >
                                            合計 {getSortIcon('total')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedMonsters.map((monster, index) => (
                                        <tr
                                            key={monster.id}
                                            className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="py-3.5 px-3 font-medium text-slate-500 border-r border-slate-100">
                                                #{monster.id.toString().padStart(3, '0')}
                                            </td>
                                            <td className="py-3.5 px-3 font-semibold text-slate-800 border-r border-slate-100">
                                                {monster.name}
                                            </td>
                                            <td className="py-3.5 px-3 border-r border-slate-100">
                                                <div className="flex gap-1 flex-wrap">
                                                    {monster.types.map((type, typeIndex) => (
                                                        <span
                                                            key={typeIndex}
                                                            className="px-2 py-0.5 rounded-md text-xs font-semibold text-white shadow-sm"
                                                            style={{
                                                                backgroundColor: getTypeColor(type),
                                                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                                                            }}
                                                        >
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[0]) }}
                                            >
                                                {monster.stats[0]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[1]) }}
                                            >
                                                {monster.stats[1]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[2]) }}
                                            >
                                                {monster.stats[2]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[3]) }}
                                            >
                                                {monster.stats[3]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[4]) }}
                                            >
                                                {monster.stats[4]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-semibold border-r border-slate-100"
                                                style={{ color: getStatColor(monster.stats[5]) }}
                                            >
                                                {monster.stats[5]}
                                            </td>
                                            <td
                                                className="py-3.5 px-3 text-center font-bold text-base"
                                                style={{ color: getTotalColor(monster.total) }}
                                            >
                                                {monster.total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Layoutを適用
PokemonStatsPage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout
            headerProps={{
                mainTitle: "ポケモン種族値一覧",
                subTitle: "種族値データベース"
            }}
        >
            {page}
        </Layout>
    );
};

// タイプの色を取得
const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
        '草': '#78C850',
        '毒': '#A040A0',
        '炎': '#F08030',
        '水': '#6890F0',
        '虫': '#A8B820',
        '飛': '#A890F0',
        '電': '#F8D030',
        '超': '#F85888',
        '氷': '#98D8D8',
        '竜': '#7038F8',
        '悪': '#705848',
        '闘': '#C03028',
        '地': '#E0C068',
        '岩': '#B8A038',
        '鋼': '#B8B8D0',
        '妖': '#EE99AC',
        '霊': '#705898',
        '普': '#A8A878'
    };
    return typeColors[type] || '#68A090';
};

// 種族値の色を取得（数値に応じた色分け）
const getStatColor = (stat: number): string => {
    if (stat >= 150) return '#dc2626'; // 赤（超高）
    if (stat >= 120) return '#ea580c'; // オレンジ（高）
    if (stat >= 100) return '#d97706'; // 黄色（やや高）
    if (stat >= 80) return '#65a30d'; // 緑（普通）
    if (stat >= 60) return '#0891b2'; // 青（やや低）
    return '#64748b'; // グレー（低）
};

// 合計種族値の色を取得
const getTotalColor = (total: number): string => {
    if (total >= 700) return '#dc2626'; // 赤（超高）
    if (total >= 600) return '#ea580c'; // オレンジ（高）
    if (total >= 500) return '#d97706'; // 黄色（やや高）
    if (total >= 400) return '#65a30d'; // 緑（普通）
    if (total >= 300) return '#0891b2'; // 青（やや低）
    return '#64748b'; // グレー（低）
};

export const getStaticProps: GetStaticProps = async () => {
    try {
        const dataDir = path.join(process.cwd(), 'data', 'monster');
        const files = await fs.readdir(dataDir);

        const monsters: Monster[] = [];

        // 全てのmonsterファイルを読み込み
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const monster: Monster = JSON.parse(content);
                monsters.push(monster);
            }
        }

        // IDでソート
        monsters.sort((a, b) => a.id - b.id);

        return {
            props: {
                monsters,
            },
            revalidate: 3600, // 1時間ごとに再生成
        };
    } catch (error) {
        console.error('Error loading monsters:', error);
        return {
            props: {
                monsters: [],
            },
        };
    }
};

export default PokemonStatsPage;
