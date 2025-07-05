import React, { useState, useEffect } from 'react';
import JsonView from '@uiw/react-json-view';
import type { NextPageWithLayout } from './_app';

const JsonViewer: NextPageWithLayout = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('raw-species');
  const [selectedId, setSelectedId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // エンドポイントの選択肢
  const endpoints = [
    { value: 'raw-species', label: 'Species', metaFile: 'species_ids.json' },
    { value: 'raw-pokemon', label: 'Pokemon', metaFile: 'pokemon_ids.json' },
    { value: 'raw-forms', label: 'Forms', metaFile: 'form_ids.json' },
  ];

  // メタデータからIDリストを読み込み
  const loadAvailableIds = async (endpoint: string) => {
    const endpointInfo = endpoints.find(e => e.value === endpoint);
    if (!endpointInfo) {
      setError('無効なエンドポイントです');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/data/meta/${endpointInfo.metaFile}`);
      if (response.ok) {
        const ids = await response.json();
        setAvailableIds(ids);

        // 現在のIDが利用可能でない場合、最初のIDに変更
        if (!ids.includes(selectedId)) {
          setSelectedId(ids[0] || 1);
        }
      } else {
        const errorMsg = `IDリストの読み込みに失敗しました (${response.status})`;
        setError(errorMsg);
        console.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'IDリストの読み込み中にエラーが発生しました';
      setError(errorMsg);
      console.error(errorMsg, error);
    }
  };

  // 初期ロード
  useEffect(() => {
    loadAvailableIds(selectedEndpoint);
  }, [selectedEndpoint]);

  // IDが変更された時にデータを自動読み込み
  useEffect(() => {
    if (availableIds.length > 0 && availableIds.includes(selectedId)) {
      loadPokemonData(selectedEndpoint, selectedId);
    }
  }, [selectedId, availableIds, selectedEndpoint]);

  const loadPokemonData = async (endpoint: string, id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/data/${endpoint}/${id}.json`);
      if (response.ok) {
        const data = await response.json();
        setJsonData(data);
      } else {
        const errorMsg = `データが見つかりません: ${endpoint}/${id} (${response.status})`;
        setError(errorMsg);
        console.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'データの読み込み中にエラーが発生しました';
      setError(errorMsg);
      console.error(errorMsg, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    // IDリストの読み込みはuseEffectで処理される
  };

  const handleIdChange = (id: number) => {
    setSelectedId(id);
    // データの読み込みはuseEffectで処理される
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JSON Viewer
          </h1>
        </div>

        {/* コントロールパネル */}
        <div className={`p-6 rounded-lg shadow-lg mb-6 ${
          isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
        }`}>
        <div className="flex flex-wrap items-center gap-4">
            {/* エンドポイント選択ドロップダウン(default = raw-species) */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                エンドポイント:
              </label>
              <select
                value={selectedEndpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                {endpoints.map((endpoint) => (
                  <option key={endpoint.value} value={endpoint.value}>
                    {endpoint.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ID選択ドロップダウン(default = 1) */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ID:
              </label>
              <select
                value={selectedId}
                onChange={(e) => handleIdChange(parseInt(e.target.value))}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                {availableIds.map((id) => (
                  <option key={id} value={id}>
                    #{id}
                  </option>
                ))}
              </select>
            </div>

            {/* ローディング表示 */}
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">読み込み中...</span>
              </div>
            )}

            {/* テーマ切り替え */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'ダーク' : 'ライト'}
            </button>
          </div>
        </div>

        {/* JSON表示エリア */}
        <div className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
        }`}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {endpoints.find(e => e.value === selectedEndpoint)?.label} - ID: {selectedId}
            </h2>
            {jsonData && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                エンドポイント: {selectedEndpoint} |
                オブジェクト数: {Object.keys(jsonData).length} |
                サイズ: {(JSON.stringify(jsonData).length / 1024).toFixed(2)} KB
              </div>
            )}
          </div>

          <div className="overflow-auto max-h-96">
            {/* エラー表示 */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">エラー: {error}</span>
                </div>
              </div>
            )}

            {/* ローディング表示 */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">読み込み中...</span>
              </div>
            )}

            {/* JSONデータ表示 */}
            {!isLoading && !error && jsonData && (
              <JsonView
                value={jsonData}
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontSize: '14px',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  lineHeight: '1.6'
                }}
              />
            )}

            {/* データが無い場合の表示 */}
            {!isLoading && !error && !jsonData && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p>データが選択されていません</p>
                <p className="text-sm">エンドポイントとIDを選択してください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// このページではレイアウトを外す
JsonViewer.getLayout = (page) => page;
export default JsonViewer;
