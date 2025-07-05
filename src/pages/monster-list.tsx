import React, { useState, useEffect, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Monster } from '../types/monster';
import MonsterList from '../components/MonsterList';
import fs from 'fs/promises';
import path from 'path';

interface MonsterListPageProps {
    monsters: Monster[];
}

const MonsterListPage: React.FC<MonsterListPageProps> = ({ monsters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState<'id' | 'name' | 'hp'>('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // 全タイプの一覧を取得
    const allTypes = useMemo(() => {
        const types = new Set<string>();
        monsters.forEach(monster => {
            monster.types.forEach(type => types.add(type));
        });
        return Array.from(types).sort();
    }, [monsters]);

    // フィルタリングとソート
    const filteredAndSortedMonsters = useMemo(() => {
        const filtered = monsters.filter(monster => {
            const matchesSearch = monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                monster.id.toString().includes(searchTerm);
            const matchesType = selectedType === '' || monster.types.includes(selectedType);
            return matchesSearch && matchesType;
        });

        // ソート
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'hp':
                    return b.stats[0] - a.stats[0]; // HP降順
                case 'id':
                default:
                    return a.id - b.id;
            }
        });

        return filtered;
    }, [monsters, searchTerm, selectedType, sortBy]);

    // ページネーション
    const totalPages = Math.ceil(filteredAndSortedMonsters.length / itemsPerPage);
    const currentMonsters = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedMonsters.slice(startIndex, endIndex);
    }, [filteredAndSortedMonsters, currentPage, itemsPerPage]);

    // ページ変更時にスクロールを上に戻す
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // 検索・フィルター変更時にページを1に戻す
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedType, sortBy]);

    return (
        <>
            <Head>
                <title>ポケモン一覧 - Monster Random</title>
                <meta name="description" content="全ポケモンの一覧を表示。検索、フィルタリング、ソート機能付き。" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'
            }}>
                {/* ヘッダー */}
                <header style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '1rem 0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 100
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 1rem',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            margin: 0
                        }}>ポケモン一覧</h1>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '2rem 0' }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '2rem',
                        padding: '0 1rem'
                    }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            margin: '0 0 0.5rem 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>全ポケモン図鑑</h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#64748b',
                            margin: 0
                        }}>
                            全{monsters.length}体のポケモンを表示しています
                        </p>
                    </div>

                    {/* 検索・フィルター部分 */}
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto 2rem',
                        padding: '0 1rem'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="名前またはIDで検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    padding: '0.75rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    background: 'white',
                                    margin: '0 auto',
                                    display: 'block',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.style.borderColor = '#3b82f6';
                                    target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.style.borderColor = '#e2e8f0';
                                    target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    background: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    minWidth: '120px'
                                }}
                            >
                                <option value="">全タイプ</option>
                                {allTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'id' | 'name' | 'hp')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    background: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    minWidth: '120px'
                                }}
                            >
                                <option value="id">ID順</option>
                                <option value="name">名前順</option>
                                <option value="hp">HP順</option>
                            </select>
                        </div>
                    </div>

                    {/* 結果表示 */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        padding: '0 1rem'
                    }}>
                        {filteredAndSortedMonsters.length}体のポケモンが見つかりました
                        ({itemsPerPage * (currentPage - 1) + 1}-{Math.min(itemsPerPage * currentPage, filteredAndSortedMonsters.length)}体目を表示)
                    </div>

                    {/* ポケモン一覧 */}
                    <MonsterList monsters={currentMonsters} />

                    {/* ページネーション */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '2rem',
                            padding: '0 1rem',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.375rem',
                                    background: currentPage === 1 ? '#f8fafc' : 'white',
                                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                                    fontSize: '0.875rem',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    minWidth: '40px',
                                    fontWeight: '500',
                                    opacity: currentPage === 1 ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1) {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.background = '#f1f5f9';
                                        target.style.borderColor = '#3b82f6';
                                        target.style.color = '#3b82f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== 1) {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.background = 'white';
                                        target.style.borderColor = '#e2e8f0';
                                        target.style.color = '#374151';
                                    }
                                }}
                            >
                                前へ
                            </button>

                            <div style={{
                                display: 'flex',
                                gap: '0.25rem',
                                margin: '0 0.5rem'
                            }}>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    const isActive = currentPage === pageNum;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '0.375rem',
                                                background: isActive ? '#3b82f6' : 'white',
                                                color: isActive ? 'white' : '#374151',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                minWidth: '40px',
                                                fontWeight: '500',
                                                borderColor: isActive ? '#3b82f6' : '#e2e8f0'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    const target = e.target as HTMLButtonElement;
                                                    target.style.background = '#f1f5f9';
                                                    target.style.borderColor = '#3b82f6';
                                                    target.style.color = '#3b82f6';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    const target = e.target as HTMLButtonElement;
                                                    target.style.background = 'white';
                                                    target.style.borderColor = '#e2e8f0';
                                                    target.style.color = '#374151';
                                                }
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.375rem',
                                    background: currentPage === totalPages ? '#f8fafc' : 'white',
                                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                                    fontSize: '0.875rem',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    minWidth: '40px',
                                    fontWeight: '500',
                                    opacity: currentPage === totalPages ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages) {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.background = '#f1f5f9';
                                        target.style.borderColor = '#3b82f6';
                                        target.style.color = '#3b82f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== totalPages) {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.background = 'white';
                                        target.style.borderColor = '#e2e8f0';
                                        target.style.color = '#374151';
                                    }
                                }}
                            >
                                次へ
                            </button>
                        </div>
                    )}
                </main>

                {/* フッター */}
                <footer style={{
                    background: '#1e293b',
                    color: 'white',
                    padding: '1.5rem 0',
                    textAlign: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 1rem'
                    }}>
                        <p style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.875rem'
                        }}>
                            © 2024 Monster Random Project
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: '#94a3b8'
                        }}>
                            PokeAPI を使用してポケモンデータを取得しています
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
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

export default MonsterListPage;
